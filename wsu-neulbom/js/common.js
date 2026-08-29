/* 우송대학교 WISE 늘봄 — 공통 스크립트 (의존성 없음) */
(function () {
	"use strict";

	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
	var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

	/* ── 모바일 GNB ───────────────────────────── */
	function initGnb() {
		var btn = $(".btn-gnb");
		var dim = $(".gnb-dim");
		if (!btn) return;

		function close() {
			document.body.classList.remove("gnb-open");
			btn.setAttribute("aria-expanded", "false");
		}
		btn.addEventListener("click", function () {
			var open = document.body.classList.toggle("gnb-open");
			btn.setAttribute("aria-expanded", String(open));
		});
		if (dim) dim.addEventListener("click", close);
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && document.body.classList.contains("gnb-open")) {
				close();
				btn.focus();
			}
		});

		/* 모바일에서 1depth 탭 시 하위 메뉴 열기 */
		$$(".gnb > ul > li").forEach(function (li) {
			var link = li.querySelector(":scope > a");
			if (!li.querySelector(".sub") || !link) return;
			link.addEventListener("click", function (e) {
				if (window.innerWidth > 1024) return;
				e.preventDefault();
				var wasOpen = li.classList.contains("open");
				$$(".gnb > ul > li").forEach(function (o) { o.classList.remove("open"); });
				li.classList.toggle("open", !wasOpen);
			});
		});
		window.addEventListener("resize", function () {
			if (window.innerWidth > 1024) close();
		});
	}

	/* ── 메인 비주얼 슬라이더 ─────────────────── */
	function initSlider() {
		var root = $(".mv");
		if (!root) return;
		var slides = $$(".mv-slide", root);
		var dots = $$(".mv-dots button", root);
		var cur = $(".mv-count .cur", root);
		var playBtn = $(".mv-play", root);
		if (slides.length < 2) return;

		var idx = 0;
		var timer = null;
		var playing = !reduceMotion;
		var DELAY = 6000;

		function show(n) {
			idx = (n + slides.length) % slides.length;
			slides.forEach(function (s, i) { s.classList.toggle("on", i === idx); });
			dots.forEach(function (d, i) { d.setAttribute("aria-selected", String(i === idx)); });
			if (cur) cur.textContent = String(idx + 1).padStart(2, "0");
		}
		function start() {
			stop();
			if (!playing) return;
			timer = setInterval(function () { show(idx + 1); }, DELAY);
		}
		function stop() { if (timer) { clearInterval(timer); timer = null; } }

		dots.forEach(function (d, i) {
			d.addEventListener("click", function () { show(i); start(); });
		});
		var prev = $(".mv-prev", root);
		var next = $(".mv-next", root);
		if (prev) prev.addEventListener("click", function () { show(idx - 1); start(); });
		if (next) next.addEventListener("click", function () { show(idx + 1); start(); });
		if (playBtn) {
			playBtn.addEventListener("click", function () {
				playing = !playing;
				playBtn.setAttribute("aria-label", playing ? "슬라이드 자동재생 정지" : "슬라이드 자동재생 시작");
				playBtn.textContent = playing ? "❙❙" : "▶";
				playing ? start() : stop();
			});
			if (!playing) { playBtn.textContent = "▶"; }
		}
		root.addEventListener("mouseenter", stop);
		root.addEventListener("mouseleave", start);
		root.addEventListener("focusin", stop);
		root.addEventListener("focusout", start);
		document.addEventListener("visibilitychange", function () {
			document.hidden ? stop() : start();
		});

		show(0);
		start();
	}

	/* ── 탭 (공지/일정 등) ────────────────────── */
	function initTabs() {
		$$(".tabs").forEach(function (list) {
			var btns = $$("button", list);
			function select(i) {
				btns.forEach(function (b, j) {
					var on = i === j;
					b.setAttribute("aria-selected", String(on));
					b.setAttribute("tabindex", on ? "0" : "-1");
					var panel = document.getElementById(b.getAttribute("aria-controls"));
					if (panel) panel.hidden = !on;
				});
			}
			btns.forEach(function (b, i) {
				b.addEventListener("click", function () { select(i); });
				b.addEventListener("keydown", function (e) {
					var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
					if (!d) return;
					e.preventDefault();
					var n = (i + d + btns.length) % btns.length;
					select(n);
					btns[n].focus();
				});
			});
			var start = btns.findIndex(function (b) { return b.getAttribute("aria-selected") === "true"; });
			select(start < 0 ? 0 : start);
		});
	}

	/* ── FAQ 아코디언 ─────────────────────────── */
	function initFaq() {
		$$(".faq-q").forEach(function (btn) {
			btn.addEventListener("click", function () {
				var open = btn.getAttribute("aria-expanded") === "true";
				btn.setAttribute("aria-expanded", String(!open));
			});
		});
	}

	/* ── 스크롤 등장 + 숫자 카운트 ───────────── */
	function initReveal() {
		var targets = $$(".rv");
		if (!("IntersectionObserver" in window) || reduceMotion) {
			targets.forEach(function (t) { t.classList.add("in"); });
			$$(".num[data-to]").forEach(function (n) { n.textContent = formatNum(+n.dataset.to); });
			return;
		}
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (!en.isIntersecting) return;
				en.target.classList.add("in");
				$$(".num[data-to]", en.target).forEach(countUp);
				if (en.target.matches(".num[data-to]")) countUp(en.target);
				io.unobserve(en.target);
			});
		}, { threshold: .18, rootMargin: "0px 0px -40px" });
		targets.forEach(function (t) { io.observe(t); });
	}

	function formatNum(v) { return v.toLocaleString("ko-KR"); }

	function countUp(el) {
		if (el.dataset.done) return;
		el.dataset.done = "1";
		var to = +el.dataset.to;
		var dur = 1400;
		var t0 = performance.now();
		(function step(now) {
			var p = Math.min((now - t0) / dur, 1);
			var eased = 1 - Math.pow(1 - p, 3);
			el.textContent = formatNum(Math.round(to * eased));
			if (p < 1) requestAnimationFrame(step);
		})(t0);
	}

	/* ── 서브 LNB 스크롤스파이 ────────────────── */
	function initSpy() {
		var lnb = $(".lnb");
		if (!lnb) return;
		var links = $$("a[href^='#']", lnb);
		var secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
			.filter(Boolean);
		if (!secs.length || !("IntersectionObserver" in window)) return;

		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (!en.isIntersecting) return;
				links.forEach(function (a) {
					a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id);
				});
			});
		}, { rootMargin: "-45% 0px -50% 0px" });
		secs.forEach(function (s) { io.observe(s); });
	}

	/* ── 패밀리 사이트 ────────────────────────── */
	function initFamily() {
		var sel = $(".family select");
		if (!sel) return;
		sel.addEventListener("change", function () {
			if (!sel.value) return;
			window.open(sel.value, "_blank", "noopener");
			sel.selectedIndex = 0;
		});
	}

	/* ── 문의 폼 (데모: 서버 연동 전 안내만) ──── */
	function initForm() {
		var form = $("#inquiry-form");
		if (!form) return;
		form.addEventListener("submit", function (e) {
			e.preventDefault();
			var msg = $(".form-msg", form);
			if (msg) {
				msg.hidden = false;
				msg.textContent = "문의가 접수되었습니다. 담당자가 2일 이내에 연락드립니다. (※ 현재 데모 화면으로 실제 전송되지 않습니다)";
			}
			form.reset();
		});
	}

	/* ── 현재 메뉴 표시 ───────────────────────── */
	function markCurrent() {
		var page = location.pathname.split("/").pop() || "index.html";
		$$(".gnb > ul > li").forEach(function (li) {
			var link = li.querySelector(":scope > a");
			if (link && link.getAttribute("href") === page) li.classList.add("on");
		});
	}

	document.addEventListener("DOMContentLoaded", function () {
		initGnb();
		initSlider();
		initTabs();
		initFaq();
		initReveal();
		initSpy();
		initFamily();
		initForm();
		markCurrent();
	});
})();
