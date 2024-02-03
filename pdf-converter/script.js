document.getElementById('convertButton').addEventListener('click', function(event) {
    var file = document.getElementById('pdfInput').files[0];
    if (file) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var typedarray = new Uint8Array(event.target.result);
            var title = document.getElementById('titleInput').value;
            var publishDate = document.getElementById('dateInput').value;
            convertToHtml(typedarray, title, publishDate);
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert('Please select a PDF file.');
    }
});


function convertToHtml(pdfData, title, publishDate) {
    pdfjsLib.getDocument(pdfData).promise.then(function(pdf) {
        var totalPages = pdf.numPages;
        var html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>`
        html += title;
        html += `</title>
        <link rel="stylesheet" href="../../styles.css">
        <link rel="stylesheet" href="../universal.css">
        <link rel="icon" type="image/x-icon" href="../../favicon.png">
    </head>
    <body>
        <header>
            <nav>
                <ul>
                    <li><a href="../../">home</a></li>
                    <li><a href="../">stories</a></li>
                    <li><a href="../../#about">about</a></li>
                    <li><a href="../../#commissions">commissions</a></li>
                    <li><a href="../../#contact">contact</a></li>
                </ul>
            </nav>
        </header>

        <section class="hero">
            <img src="../../sadie.jpg" alt="Profile Picture" class="profile-picture">
            <h1>sadeswrites' portfolio</h1>
            <p>queer-friendly sci-fi and fantasy short stories</p>
            <a href="../" class="btn">explore stories</a>
        </section>
    
        <section class="story-container">
            <article class="story">
                <h1 class="story-title">`;
        html += title;
        html += `</h1>
        <p class="story-metadata">Published on `;
        html += formatDate ( publishDate );
        html += `</p>
        <div class="story-content">
        <p>`;
        var loopCount = 0;
        for (var i = 1; i <= totalPages; i++) {
            pdf.getPage(i).then(function(page) {
                page.getTextContent().then(function(textContent) {
                    loopCount ++;
                    textContent.items.forEach(function(textItem) {
                        html += textItem.str ;
                        if (textItem.str === "") {
                            html += `</p><br/><p>`;
                        }
                    });
                    if (loopCount === totalPages) {
                        html += `</p></div>
                        </article>
                    </section>
                
                    <footer>
                        <ul>
                            <li><a href="https://www.tumblr.com/sadeswrites">tumblr</a></li>
                            <li><a href="https://www.fiverr.com/sadeswrites">fiverr</a></li>
                            <li><a href="https://www.threads.net/@sadeswrites">threads</a></li>
                            <li><a href="https://www.instagram.com/sadeswrites/">instagram</a></li>
                        </ul>
                        <p>&copy;2024 sadeswrites</p>
                    </footer>
                </body>
                </html>
                `;
                //saveHtmlToFile(replaceParagraphsWithBreaks(html));
                saveHtmlToFile(html);
                        
                    } ; 
                });
            });
        };
    });
}

function saveHtmlToFile(htmlContent) {
    var blob = new Blob([htmlContent], { type: 'text/html' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = '';
    link.click();
}

function formatDate(dateString) {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const parts = dateString.split('-');
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[0], 10);

    const suffix = (day === 1 || day === 21 || day === 31) ? "st" :
        (day === 2 || day === 22) ? "nd" :
        (day === 3 || day === 23) ? "rd" : "th";

    return `${month} ${day}${suffix}, ${year}`;
}

function replaceParagraphsWithBreaks(htmlString) {
    // Use a regular expression to replace </p><p> with </p><br/><p>
    return htmlString.replace(/<p><\/p>/g, '</p><br/><p>');
}