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
    
    // Load and render blog posts
    fetch('./blogs/posts.json')
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

            // Event listener for blog post links
            document.querySelectorAll('.blog-post-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const postFile = e.target.getAttribute('data-post');
                    const postTitle = e.target.textContent;
                    fetch(`./blogs/${postFile}`)
                        .then(response => response.text())
                        .then(markdown => {
                            const html = marked.parse(markdown);
                            showBlogPost(html, postTitle);
                        })
                        .catch(error => {
                            console.error('Error loading blog post:', error);
                            alert('Failed to load blog post. Please try again later.');
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error loading posts.json:', error);
            document.getElementById('blog-posts').innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
        });

    // Modify the marked options to use Prism for syntax highlighting
    marked.setOptions({
        highlight: function(code, lang) {
            if (Prism.languages[lang]) {
                return Prism.highlight(code, Prism.languages[lang], lang);
            } else {
                return code;
            }
        }
    });

    function showBlogPost(content, title) {
        // Store the content in sessionStorage
        sessionStorage.setItem('blogPostContent', content);
        sessionStorage.setItem('blogPostTitle', title);
        
        // Navigate to the blog post page
        window.location.href = 'blogpost.html';
    }
});
