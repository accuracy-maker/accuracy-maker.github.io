document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add a subtle fade-in effect to sections
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Add a "Back to Top" button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add hover effect to project links
    const projectLinks = document.querySelectorAll('.section ul li a');
    projectLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.textDecoration = 'underline';
        });
        link.addEventListener('mouseleave', () => {
            link.style.textDecoration = 'none';
        });
    });

    // Load and render blog posts
    fetch('blogs/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            const blogContainer = document.getElementById('blog-posts');
            posts.forEach(post => {
                const postElement = document.createElement('article');
                postElement.innerHTML = `
                    <h3><a href="#" class="blog-post-link" data-post="${post.file}">${post.title}</a></h3>
                    <p>${post.excerpt}</p>
                `;
                blogContainer.appendChild(postElement);
            });

            // Add click event listeners to blog post links
            document.querySelectorAll('.blog-post-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const postFile = e.target.getAttribute('data-post');
                    fetch(`blogs/${postFile}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(markdown => {
                            const html = marked.parse(markdown);
                            showBlogPostModal(html);
                        })
                        .catch(error => console.error('Error loading blog post:', error));
                });
            });
        })
        .catch(error => console.error('Error loading posts.json:', error));

    function showBlogPostModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="blog-post-content">${content}</div>
            </div>
        `;
        document.body.appendChild(modal);

        // Render MathJax content
        MathJax.typesetPromise([modal]).catch((err) => console.log('MathJax typesetting failed: ' + err.message));

        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            document.body.removeChild(modal);
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                document.body.removeChild(modal);
            }
        }
    }
});
