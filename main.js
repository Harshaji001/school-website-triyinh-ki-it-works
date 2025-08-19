// Main interactivity: sticky header, hamburger, smooth scroll, reveals, lightbox, form validation, ticker, typing

document.addEventListener('DOMContentLoaded', () => {
	// Elements
	const header = document.getElementById('site-header');
	const hamburger = document.getElementById('hamburger');
	const nav = document.getElementById('nav');
	const backToTop = document.getElementById('backToTop');
	const yearEl = document.getElementById('year');
	const themeToggle = document.getElementById('themeToggle');

	yearEl.textContent = new Date().getFullYear();

	// Hamburger toggle
	hamburger.addEventListener('click', () => {
		nav.classList.toggle('open');
		hamburger.classList.toggle('open');
	});

	// Sticky header shadow on scroll
	window.addEventListener('scroll', () => {
		if (window.scrollY > 18) {
			header.style.boxShadow = '0 8px 30px rgba(11,114,255,0.08)';
		} else {
			header.style.boxShadow = '';
		}
		// back to top
		if (window.scrollY > 400) backToTop.style.display = 'block'; else backToTop.style.display = 'none';
	});

	// Smooth scroll for internal links
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', function (e) {
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				e.preventDefault();
				target.scrollIntoView({behavior:'smooth',block:'start'});
				// close nav on mobile
				if (nav.classList.contains('open')) nav.classList.remove('open');
			}
		});
	});

	// Back to top
	backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

	// Reveal on scroll (IntersectionObserver)
	const reveals = document.querySelectorAll('.reveal, .cards-grid .card, .gallery-item, .teacher-card, .principal-card, .about-media, .hero-content');
	const obs = new IntersectionObserver((entries) => {
		entries.forEach(e => {
			if (e.isIntersecting) {
				e.target.classList.add('visible');
				obs.unobserve(e.target);
			}
		});
	},{threshold:0.12});
	reveals.forEach(r => obs.observe(r));

	// Lazy load gallery images (data-src)
	document.querySelectorAll('img[data-src]').forEach(img => {
		img.src = img.dataset.src;
		img.removeAttribute('data-src');
	});

	// Simple lightbox
	const lightbox = document.getElementById('lightbox');
	const lightboxImg = document.getElementById('lightboxImg');
	const lightboxCaption = document.getElementById('lightboxCaption');
	const lightboxClose = document.getElementById('lightboxClose');

	document.querySelectorAll('.gallery-item').forEach(img => {
		img.addEventListener('click', () => {
			const full = img.dataset.full || img.src;
			lightboxImg.src = full;
			lightboxImg.alt = img.alt || '';
			lightboxCaption.textContent = img.alt || '';
			lightbox.setAttribute('aria-hidden','false');
		});
	});

	lightboxClose.addEventListener('click', () => {
		lightbox.setAttribute('aria-hidden','true');
		lightboxImg.src = '';
	});
	lightbox.addEventListener('click', (e) => {
		if (e.target === lightbox) {
			lightbox.setAttribute('aria-hidden','true');
			lightboxImg.src = '';
		}
	});

	// Notices ticker (rotate messages)
	const notices = [
		"School reopens on 1st June — New timetable published.",
		"Parent-teacher meeting scheduled for 15th June.",
		"Annual sports day registrations open now.",
		"Admission forms for 2025 are now available."
	];
	const tickerEl = document.getElementById('noticeTicker');
	let nIndex = 0;
	function showNotice(i){
		tickerEl.textContent = notices[i];
		tickerEl.animate([{transform:'translateX(20px)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.9,.3,1)'});
	}
	showNotice(0);
	setInterval(() => {
		nIndex = (nIndex + 1) % notices.length;
		showNotice(nIndex);
	}, 4200);

	// Contact form validation (client-side)
	const form = document.getElementById('contactForm');
	if (form){
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			let valid = true;
			const name = document.getElementById('name');
			const email = document.getElementById('email');
			const message = document.getElementById('message');
			const nameError = document.getElementById('nameError');
			const emailError = document.getElementById('emailError');
			const messageError = document.getElementById('messageError');
			// Reset
			nameError.textContent = emailError.textContent = messageError.textContent = '';

			if (!name.value.trim()){ nameError.textContent = 'Please enter your name'; valid = false; }
			if (!/^\S+@\S+\.\S+$/.test(email.value)){ emailError.textContent = 'Enter a valid email'; valid = false; }
			if (message.value.trim().length < 10){ messageError.textContent = 'Message is too short'; valid = false; }

			if (!valid) return;

			// Mock success (replace with AJAX in real site)
			document.getElementById('formSuccess').textContent = 'Message sent successfully. Thank you!';
			form.reset();
			setTimeout(()=>document.getElementById('formSuccess').textContent = '', 5000);
		});
	}

	// Simple typing effect (hero)
	const typedEl = document.getElementById('typed');
	const phrases = ["Inspiring Young Minds","Excellence in Learning","Creativity • Curiosity • Character"];
	let p = 0; let char = 0; let forward = true;
	function typeLoop(){
		const full = phrases[p];
		if (forward){
			char++;
			if (char > full.length){ forward = false; setTimeout(typeLoop,1200); return; }
		} else {
			char--;
			if (char === 0){ forward = true; p = (p+1)%phrases.length; setTimeout(typeLoop,300); return; }
		}
		typedEl.textContent = full.slice(0,char);
		setTimeout(typeLoop, forward ? 80 : 30);
	}
	typeLoop();

	// Theme toggle (dark mode)
	const root = document.documentElement;
	themeToggle.addEventListener('click', () => {
		const dark = root.getAttribute('data-theme') === 'dark';
		if (dark) root.removeAttribute('data-theme');
		else root.setAttribute('data-theme','dark');
		themeToggle.textContent = dark ? '🌙' : '☀️';
	});

	// Close mobile nav when clicking outside
	document.addEventListener('click', (e) => {
		if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
			nav.classList.remove('open');
		}
	});
});
