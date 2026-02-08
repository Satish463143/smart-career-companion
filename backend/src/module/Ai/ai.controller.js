const generateAiResponse = require("../../utils/ai.service");
const ChatModel = require("./chat.model");

class AiController {
    chat = async (req, res, next) => {
        try {
            // Check for user in req.user (middleware) or req.body (temporary fallback works for now)
            // Prioritize req.user if it exists as it's more secure
            const user = req.user;
            let userId = user ? user.uid : req.body.userId;

            if (!userId) { 
               // user will come from frontend
               return res.status(400).json({ status: 400, message: "User ID is required." });
            }

            const { message } = req.body;
            if(!message) {
                 return res.status(400).json({ status: 400, message: "Message is required." });
            }

            const aiResponse = await generateAiResponse(userId, message);
            
            const chatData = {
                userId,
                userMessage: message,
                aiResponse,
                timestamp: new Date()
            };

            const savedChat = await ChatModel.save(chatData);

            res.status(200).json({
                result: savedChat,
                message: "Chat created successfully",
                meta: null
            });
            
        } catch(error) {
            console.log("chat error", error);
            next(error);
        }
    }
    careerRecommendation = async (req, res, next) => {
        try {
            const user = req.user;
            let userId = user ? user.uid : req.body.userId;

            if (!userId) {
                return res.status(400).json({ status: 400, message: "User ID is required." });
            }

            // Fetch user data from subcollections in parallel
            const db = require("../../config/db.config");
            const userRef = db.collection("users").doc(userId);
            
            const [educationSnap, skillsSnap, projectsSnap, certificatesSnap] = await Promise.all([
                userRef.collection("education").get(),
                userRef.collection("skills").get(),
                userRef.collection("projects").get(),
                userRef.collection("certificates").get()
            ]);

            const education = educationSnap.docs.map(doc => doc.data());
            const skills = skillsSnap.docs.map(doc => doc.data());
            const projects = projectsSnap.docs.map(doc => doc.data());
            const certificates = certificatesSnap.docs.map(doc => doc.data());

            // Construct Prompt
            const prompt = `
            Act as an expert Career Counselor and HR Specialist. Analyze the following user profile and provide personalized career recommendations.
            
            User Profile:
            - Education: ${JSON.stringify(education)}
            - Skills: ${JSON.stringify(skills)}
            - Projects: ${JSON.stringify(projects)}
            - Certificates: ${JSON.stringify(certificates)}

            Please provide:
            1. Top 3 Career Paths: Prioritize roles that match their current skills.
            2. Skill Gaps: Brief list of missing skills for senior roles.
            3. Recommended Next Steps: Actionable advice.
            
            IMPORTANT FORMATTING RULES:
            - Keep it CONCISE and MINIMAL (max 150 words).
            - DO NOT use Markdown symbols like *, #, -, or **.
            - Use Numbered Lists (1., 2., 3.) for main points.
            - Use UPPERCASE for section headers (e.g., "CAREER PATHS:").
            - Use "strong font" for section headers, titles, and important words.
            `;

            const aiResponse = await generateAiResponse(userId, prompt);

            const recommendationData = {
                recommendation: aiResponse,
                profileSnapshot: {
                    educationCount: education.length,
                    skillsCount: skills.length,
                    projectsCount: projects.length
                }
            };

            const savedRecommendation = await require("./career.model").save(userId, recommendationData);

            res.status(200).json({
                result: savedRecommendation,
                message: "Career recommendation generated successfully",
                meta: null
            });

        } catch (error) {
            console.log("career recommendation error", error);
            next(error);
        }
    }
    resumeGenerator = async (req, res, next) => {
        try {
            const user = req.user;
            let userId = user ? user.uid : req.body.userId;

            if (!userId) {
                return res.status(400).json({ status: 400, message: "User ID is required." });
            }

            // Fetch user data
            const db = require("../../config/db.config");
            const admin = require("firebase-admin");
            const userRef = db.collection("users").doc(userId);
            
            // Parallel fetch: User Doc + Subcollections
            const [userDocSnap, educationSnap, skillsSnap, projectsSnap, certificatesSnap] = await Promise.all([
                userRef.get(),
                userRef.collection("education").get(),
                userRef.collection("skills").get(),
                userRef.collection("projects").get(),
                userRef.collection("certificates").get()
            ]);

            console.log(`[ResumeGenerator] Fetching data for User: ${userId}`);
            console.log(`[ResumeGenerator] Found: Education(${educationSnap.size}), Skills(${skillsSnap.size}), Projects(${projectsSnap.size}), Certificates(${certificatesSnap.size})`);

            const userFirestoreData = userDocSnap.exists ? userDocSnap.data() : {};

            // Fetch user details from Auth if not in req.user
            let userData = user;
            if (!userData) {
                try {
                    userData = await admin.auth().getUser(userId);
                } catch (err) {
                    console.log("Error fetching user from auth:", err);
                    userData = { displayName: "Candidate", email: "email@example.com" };
                }
            }

            // Consolidate Profile Data
            const profile = {
                education: educationSnap.docs.map(d => d.data()),
                skills: skillsSnap.docs.map(d => d.data()),
                projects: projectsSnap.docs.map(d => d.data()),
                // Personal Info Prioritization: Firestore > Auth > Fallback
                fullName: userFirestoreData.displayName || userFirestoreData.name || userData.displayName || "Candidate Name", 
                email: userFirestoreData.email || userData.email || "email@example.com",
                phone: userFirestoreData.phone || userFirestoreData.phoneNumber || "",
                // Social Links
                linkedin: userFirestoreData.linkedin || userFirestoreData.linkedIn || "",
                github: userFirestoreData.github || userFirestoreData.gitHub || "",
                portfolio: userFirestoreData.portfolio || userFirestoreData.website || "",
                photoURL: userFirestoreData.photoURL || userData.photoURL || ""
            };

            // Enhanced Prompt for JSON Output
            const prompt = `
            Act as a Professional Resume Writer. Convert the following profile data into a structured JSON for a high-quality resume.
            Improve the language to be more professional (use action verbs).
            
            Profile Data: ${JSON.stringify(profile)}

            Output MUST be valid JSON with this exact structure (no markdown formatting):
            {
                "fullName": "${profile.fullName}",
                "email": "${profile.email}",
                "phone": "${profile.phone}",
                "socialLinks": {
                    "linkedin": "${profile.linkedin}",
                    "github": "${profile.github}",
                    "portfolio": "${profile.portfolio}"
                },
                "summary": "A professional summary...",
                "skills": ["Skill1", "Skill2"...],
                "experience": [
                    {"role": "Project Title or Role", "company": "Self/Academic", "duration": "Year", "details": "Detailed description..."}
                ],
                "education": [
                    {"degree": "Degree Name", "school": "School Name", "year": "Year"}
                ]
            }
            `;

            const rawAiResponse = await generateAiResponse(userId, prompt);
            
            // Clean AI response
            const cleanJson = rawAiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            let resumeContent;
            try {
                resumeContent = JSON.parse(cleanJson);
                
                // FORCE OVERWRITE contact info with real data to ensure accuracy
                // (AI sometimes hallucinates or formats these wrong)
                resumeContent.fullName = profile.fullName;
                resumeContent.email = profile.email;
                resumeContent.phone = profile.phone;
                resumeContent.socialLinks = {
                    linkedin: profile.linkedin,
                    github: profile.github,
                    portfolio: profile.portfolio
                };
                resumeContent.photoURL = profile.photoURL;

            } catch (e) {
                console.error("Failed to parse AI JSON response", cleanJson);
                throw new Error("AI failed to generate valid structured data.");
            }

            // Generate PDF
            const generateResumePDF = require("../../utils/pdf.service");
            const pdfBuffer = await generateResumePDF(resumeContent);

            // Save and Return
            const savedResume = await require("./resume.model").save(userId, resumeContent, pdfBuffer);

            res.status(200).json({
                result: savedResume,
                message: "Resume generated successfully",
                meta: null
            });

        } catch (error) {
            console.log("resume generator error", error);
            next(error);
        }
    }
}

module.exports = new AiController();
