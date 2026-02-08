const PDFDocument = require('pdfkit');

const generateResumePDF = (data) => {
    return new Promise(async (resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // --- Styles & Colors ---
        const primaryColor = '#2563EB'; // Blue
        const secondaryColor = '#1F2937'; // Dark Gray
        const bodyColor = '#4B5563'; // Gray
        
        // --- Header Section ---
        doc.rect(0, 0, 612, 140).fill(primaryColor); // Top Banner
        
        doc.fillColor('white').fontSize(26).font('Helvetica-Bold')
           .text(data.fullName || "Your Name", 50, 40);
        
        doc.fontSize(12).font('Helvetica');
        
        let contactY = 75;
        if(data.email) {
            doc.text(data.email, 50, contactY);
            contactY += 15;
        }
        if(data.phone) {
            doc.text(data.phone, 50, contactY);
            contactY += 15;
        }

        // Social Links
        if (data.socialLinks) {
            doc.fontSize(10);
            if(data.socialLinks.linkedin) {
                doc.text(`LinkedIn: ${data.socialLinks.linkedin}`, 50, contactY, { link: data.socialLinks.linkedin });
                contactY += 13;
            }
            if(data.socialLinks.github) {
                doc.text(`GitHub: ${data.socialLinks.github}`, 50, contactY, { link: data.socialLinks.github });
                contactY += 13;
            }
            if(data.socialLinks.portfolio) {
                doc.text(`Portfolio: ${data.socialLinks.portfolio}`, 50, contactY, { link: data.socialLinks.portfolio });
                contactY += 13;
            }
        }

        // Add a decorative line or circle
        // Profile Photo
        if (data.photoURL) {
            try {
                // Fetch image (using native fetch, requires Node 18+)
                const response = await fetch(data.photoURL);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const imgBuffer = Buffer.from(arrayBuffer);
                    
                    try {
                        doc.save();
                        doc.circle(550, 70, 40).clip();
                        // Center 550, 70; Radius 40 -> TopLeft 510, 30; Diameter 80
                        doc.image(imgBuffer, 510, 30, { width: 80, height: 80 }); 
                        doc.restore();
                    } catch (imageError) {
                        console.warn("PDF Generation: Failed to embed image (likely unsupported format like WebP/SVG). Falling back to placeholder.", imageError.message);
                        doc.restore(); // Ensure state is restored
                        
                        // Fallback: Circle with Initial
                        doc.circle(550, 70, 40).fill('white');
                        doc.fillColor(primaryColor).fontSize(30).font('Helvetica-Bold')
                           .text(data.fullName ? data.fullName.charAt(0).toUpperCase() : "U", 538, 55);
                    }
                } else {
                    // Fallback if fetch fails
                     doc.circle(550, 70, 40).fillOpacity(0.2).fill('white').fillOpacity(1);
                }
            } catch (err) {
                 console.error("Error fetching profile photo for PDF:", err);
                 doc.circle(550, 70, 40).fillOpacity(0.2).fill('white').fillOpacity(1);
            }
        } else {
             doc.circle(550, 70, 40).fillOpacity(0.2).fill('white').fillOpacity(1);
        }

        doc.moveDown(4);

        // --- Professional Summary ---
        if (data.summary) {
            drawSectionHeader(doc, "Professional Summary", primaryColor);
            doc.fillColor(bodyColor).fontSize(11).font('Helvetica')
               .text(data.summary, { align: 'justify' });
            doc.moveDown(1.5);
        }

        // --- Skills ---
        if (data.skills && data.skills.length > 0) {
            drawSectionHeader(doc, "Core Competencies", primaryColor);
            
            // Render skills as badges/bubbles
            let x = 50;
            let y = doc.y;
            const skillGap = 10;
            const rowHeight = 25;
            
            doc.font('Helvetica-Bold').fontSize(10);
            
            data.skills.forEach(skill => {
                const width = doc.widthOfString(skill) + 20;
                if (x + width > 500) { x = 50; y += rowHeight; }
                
                // Draw background manually for "badge" look is hard in basic pdfkit without clean vector math
                // So we stick to a clean list or grid. Let's do a clean comma-separated list for better layout saftey.
            });
            
            // Fallback to text list for robustness
            doc.fillColor(bodyColor).fontSize(11).font('Helvetica')
               .text(data.skills.join("  •  "));
            doc.moveDown(1.5);
        }

        // --- Experience ---
        if (data.experience && data.experience.length > 0) {
            drawSectionHeader(doc, "Experience", primaryColor);
            
            data.experience.forEach(exp => {
                doc.fillColor(secondaryColor).fontSize(12).font('Helvetica-Bold')
                   .text(exp.role, { continued: true })
                   .fillColor(primaryColor).fontSize(10)
                   .text(`   ${exp.company || ''}`, { align: 'left' });
                   
                doc.fillColor('#6B7280').fontSize(10).font('Helvetica-Oblique')
                   .text(exp.duration || '');
                
                doc.moveDown(0.5);
                
                if (exp.details) {
                    doc.fillColor(bodyColor).fontSize(10).font('Helvetica')
                       .text(exp.details, { align: 'justify' });
                }
                doc.moveDown(1);
            });
            doc.moveDown(0.5);
        }

        // --- Education ---
        if (data.education && data.education.length > 0) {
            drawSectionHeader(doc, "Education", primaryColor);
            
            data.education.forEach(edu => {
                doc.fillColor(secondaryColor).fontSize(12).font('Helvetica-Bold')
                   .text(edu.degree);
                doc.fillColor(bodyColor).fontSize(11).font('Helvetica')
                   .text(`${edu.school}  |  ${edu.year}`);
                doc.moveDown(0.8);
            });
        }

        // --- Footer ---
        doc.fontSize(8).fillColor('#9CA3AF')
           .text("Generated by Smart Career Companion AI", 50, 730, { align: 'center' });

        doc.end();
    });
};

function drawSectionHeader(doc, title, color) {
    doc.fillColor(color).fontSize(14).font('Helvetica-Bold').text(title.toUpperCase());
    doc.rect(50, doc.y + 2, 512, 2).fill(color); // Underline
    doc.moveDown(0.8);
}

module.exports = generateResumePDF;
