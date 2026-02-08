const header = document.querySelector(".header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const hashNavLinks = navLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));

const skillBars = document.querySelectorAll(".skill-progress");
const contactForm = document.getElementById("contactForm");

const closeMobileMenu = () => {
  navMenu?.classList.remove("active");
  navToggle?.classList.remove("active");
};

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });
}

const scrollToSection = (targetId) => {
  const targetSection = document.querySelector(targetId);
  if (!targetSection) {
    return false;
  }

  const offset = (header?.offsetHeight || 0) + 12;
  const top = targetSection.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
};

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }

    if (!scrollToSection(href)) {
      return;
    }

    event.preventDefault();
    closeMobileMenu();
  });
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 30);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (skillBars.length > 0) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const bar = entry.target;
        const level = bar.getAttribute("data-level") || "0%";
        bar.style.width = level;
        skillObserver.unobserve(bar);
      });
    },
    { threshold: 0.35 }
  );

  skillBars.forEach((bar) => {
    bar.style.width = "0%";
    skillObserver.observe(bar);
  });
}

const revealTargets = document.querySelectorAll(".reveal");
if (revealTargets.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      alert("すべての項目を入力してください。");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("正しいメールアドレスを入力してください。");
      return;
    }

    console.log("contact payload", { name, email, message });
    alert("メッセージを受け取りました。ありがとうございます。");
    contactForm.reset();
  });
}

const sections = Array.from(document.querySelectorAll("section[id]"));
window.addEventListener(
  "scroll",
  () => {
    if (hashNavLinks.length === 0 || sections.length === 0) {
      return;
    }

    let currentId = "";
    const scrollY = window.scrollY + (header?.offsetHeight || 0) + 28;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentId = section.id;
      }
    });

    hashNavLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  },
  { passive: true }
);

const isTypingTarget = (element) => {
  if (!element) return false;
  const tag = element.tagName?.toLowerCase?.() || "";
  return tag === "input" || tag === "textarea" || element.isContentEditable;
};

const copyText = async (text) => {
  const value = String(text || "");
  if (!value) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.setAttribute("readonly", "true");
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
};

document.addEventListener("click", async (event) => {
  const btn = event.target?.closest?.("[data-lab-copy]");
  if (!btn) return;

  const text = btn.textContent || "";
  const ok = await copyText(text);
  if (!ok) return;

  btn.dataset.copied = "true";
  const prev = btn.textContent;
  btn.textContent = "copied.";
  window.setTimeout(() => {
    btn.textContent = prev;
    delete btn.dataset.copied;
  }, 650);
});

const boostVibe = () => {
  document.body.classList.add("sudo-vibe");
  window.setTimeout(() => document.body.classList.remove("sudo-vibe"), 1100);
};

const initLab = () => {
  const glitchInput = document.querySelector("[data-lab-glitch-input]");
  const glitchOutput = document.querySelector("[data-lab-glitch-output]");
  const glitchRun = document.querySelector("[data-lab-glitch-run]");
  const glitchReset = document.querySelector("[data-lab-glitch-reset]");

  const encodeInput = document.querySelector("[data-lab-encode-input]");
  const hexOutput = document.querySelector("[data-lab-encode-hex]");
  const b64Output = document.querySelector("[data-lab-encode-b64]");

  const scanlinesToggle = document.querySelector("[data-ambient-scanlines]");
  const gridToggle = document.querySelector("[data-ambient-grid]");
  const bloomToggle = document.querySelector("[data-ambient-bloom]");
  const sudoButton = document.querySelector("[data-ambient-sudo]");

  if (glitchInput && glitchOutput) {
    const base = String(glitchInput.value || "");
    glitchOutput.textContent = base;

    const glitch = () => {
      const src = String(glitchInput.value || "");
      const noise = "█▓▒░<>/\\\\|_+=-*#@$%";
      const out = src
        .split("")
        .map((ch) => {
          if (Math.random() < 0.22 && ch.trim()) {
            return noise[Math.floor(Math.random() * noise.length)];
          }
          return ch;
        })
        .join("");
      glitchOutput.textContent = out || src;
      boostVibe();
    };

    glitchRun?.addEventListener("click", glitch);
    glitchReset?.addEventListener("click", () => {
      glitchInput.value = "reo.";
      glitchOutput.textContent = "reo.";
    });

    glitchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        glitch();
      }
    });
  }

  const toHex = (bytes) =>
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const toBase64 = (bytes) => {
    let bin = "";
    bytes.forEach((b) => {
      bin += String.fromCharCode(b);
    });
    return btoa(bin);
  };

  const refreshEncode = () => {
    if (!encodeInput || !hexOutput || !b64Output) return;
    const text = String(encodeInput.value || "");
    const bytes = new TextEncoder().encode(text);
    hexOutput.textContent = toHex(bytes);
    b64Output.textContent = toBase64(bytes);
  };

  if (encodeInput && hexOutput && b64Output) {
    refreshEncode();
    encodeInput.addEventListener("input", refreshEncode);
  }

  if (scanlinesToggle) {
    document.body.classList.toggle("scanlines-off", !scanlinesToggle.checked);
    scanlinesToggle.addEventListener("change", () => {
      document.body.classList.toggle("scanlines-off", !scanlinesToggle.checked);
    });
  }

  if (gridToggle) {
    document.body.classList.toggle("grid-off", !gridToggle.checked);
    gridToggle.addEventListener("change", () => {
      document.body.classList.toggle("grid-off", !gridToggle.checked);
    });
  }

  if (bloomToggle) {
    document.body.classList.toggle("bloom-off", !bloomToggle.checked);
    bloomToggle.addEventListener("change", () => {
      document.body.classList.toggle("bloom-off", !bloomToggle.checked);
    });
  }

  sudoButton?.addEventListener("click", () => {
    boostVibe();
  });
};

const initLogs = () => {
  const valueEl = document.querySelector("[data-fingerprint]");
  const refreshBtn = document.querySelector("[data-fingerprint-refresh]");
  const copyBtn = document.querySelector("[data-fingerprint-copy]");

  if (!valueEl) return;

  const make = () => {
    const bytes = new Uint8Array(16);
    (crypto?.getRandomValues?.bind(crypto) || ((arr) => arr))(bytes);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `sess_${hex}`;
  };

  const setValue = () => {
    valueEl.textContent = make();
  };

  setValue();
  refreshBtn?.addEventListener("click", setValue);
  copyBtn?.addEventListener("click", async () => {
    await copyText(valueEl.textContent || "");
    boostVibe();
  });
};

const initCommandPalette = () => {
  const root = document.getElementById("cmdk");
  const input = document.getElementById("cmdk-input");
  const list = document.getElementById("cmdk-list");
  const openButtons = Array.from(document.querySelectorAll("[data-cmdk-open]"));
  const closeTargets = Array.from(document.querySelectorAll("[data-cmdk-close]"));

  if (!root || !input || !list) {
    return;
  }

  let isOpen = false;
  let selectedIndex = 0;
  let filtered = [];
  let lastFocus = null;

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isIndex = page === "" || page === "index.html";

  const go = (href) => {
    if (href.startsWith("#")) {
      if (scrollToSection(href)) return;
    }
    window.location.href = href;
  };

  const commands = [
    {
      id: "go-home",
      title: "Go: Home",
      sub: "トップへ移動",
      kbd: "H",
      keywords: "home top",
      run: () => go(isIndex ? "#home" : "index.html#home"),
    },
    {
      id: "go-about",
      title: "Go: About",
      sub: "自己紹介へ",
      kbd: "A",
      keywords: "about profile",
      run: () => go(isIndex ? "#about" : "index.html#about"),
    },
    {
      id: "go-projects",
      title: "Go: Projects",
      sub: "作品一覧へ",
      kbd: "P",
      keywords: "projects work",
      run: () => go(isIndex ? "#projects" : "index.html#projects"),
    },
    {
      id: "go-contact",
      title: "Go: Contact",
      sub: "連絡先へ",
      kbd: "C",
      keywords: "contact mail",
      run: () => go(isIndex ? "#contact" : "index.html#contact"),
    },
    {
      id: "open-lab",
      title: "Open: Lab",
      sub: "遊びの実験場",
      kbd: "L",
      keywords: "lab tools glitch hex",
      run: () => go("lab.html"),
    },
    {
      id: "open-logs",
      title: "Open: Logs",
      sub: "制作ログ",
      kbd: "G",
      keywords: "logs timeline audit",
      run: () => go("logs.html"),
    },
    {
      id: "open-x",
      title: "Open: X",
      sub: "@r3o_caffeine",
      kbd: "X",
      keywords: "x twitter",
      run: () => window.open("https://x.com/r3o_caffeine", "_blank", "noopener,noreferrer"),
    },
    {
      id: "open-github",
      title: "Open: GitHub",
      sub: "@rE09o1v",
      kbd: "GH",
      keywords: "github",
      run: () => window.open("https://github.com/rE09o1v", "_blank", "noopener,noreferrer"),
    },
    {
      id: "open-rr",
      title: "Repo: transport_daily_report",
      sub: "らくレポ！",
      kbd: "R1",
      keywords: "rakurepo flutter transport report",
      run: () =>
        window.open("https://github.com/rE09o1v/transport_daily_report", "_blank", "noopener,noreferrer"),
    },
    {
      id: "open-corc",
      title: "Repo: c-orc",
      sub: "TUI orchestrator",
      kbd: "R2",
      keywords: "c-orc textual langgraph",
      run: () => window.open("https://github.com/rE09o1v/c-orc", "_blank", "noopener,noreferrer"),
    },
    {
      id: "open-eoc",
      title: "Repo: eye-of-cascade",
      sub: "session dashboard",
      kbd: "R3",
      keywords: "eye-of-cascade nextjs vitest",
      run: () => window.open("https://github.com/rE09o1v/eye-of-cascade", "_blank", "noopener,noreferrer"),
    },
    {
      id: "sudo",
      title: "sudo vibe --boost",
      sub: "ambient boost",
      kbd: "!",
      keywords: "sudo boost vibe",
      run: () => boostVibe(),
    },
  ];

  const normalize = (value) => String(value || "").toLowerCase().trim();

  const match = (cmd, query) => {
    if (!query) return true;
    const hay = normalize(`${cmd.title} ${cmd.sub || ""} ${cmd.keywords || ""}`);
    return query
      .split(/\s+/)
      .filter(Boolean)
      .every((token) => hay.includes(token));
  };

  const render = () => {
    list.innerHTML = "";
    filtered.forEach((cmd, idx) => {
      const li = document.createElement("li");
      li.className = "cmdk-item";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", idx === selectedIndex ? "true" : "false");

      const title = document.createElement("div");
      title.className = "cmdk-item-title";
      title.textContent = cmd.title;

      if (cmd.kbd) {
        const k = document.createElement("span");
        k.className = "cmdk-kbd";
        k.textContent = cmd.kbd;
        title.appendChild(k);
      }

      li.appendChild(title);

      if (cmd.sub) {
        const sub = document.createElement("div");
        sub.className = "cmdk-item-sub";
        sub.textContent = cmd.sub;
        li.appendChild(sub);
      }

      li.addEventListener("click", () => {
        close();
        cmd.run();
      });

      list.appendChild(li);
    });
  };

  const update = () => {
    const q = normalize(input.value);
    filtered = commands.filter((cmd) => match(cmd, q));
    if (filtered.length === 0) {
      filtered = [
        {
          id: "noop",
          title: "No results",
          sub: "Try: projects, x, lab, sudo",
          kbd: "",
          run: () => {},
        },
      ];
    }
    selectedIndex = Math.max(0, Math.min(selectedIndex, filtered.length - 1));
    render();
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    input.value = "";
    selectedIndex = 0;
    update();
    window.setTimeout(() => input.focus(), 0);
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  };

  openButtons.forEach((btn) => btn.addEventListener("click", open));
  closeTargets.forEach((el) => el.addEventListener("click", close));

  input.addEventListener("input", () => {
    selectedIndex = 0;
    update();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedIndex = Math.min(filtered.length - 1, selectedIndex + 1);
      render();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedIndex = Math.max(0, selectedIndex - 1);
      render();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const cmd = filtered[selectedIndex];
      close();
      cmd?.run?.();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
      close();
      return;
    }

    if (isTypingTarget(event.target)) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
      return;
    }

    if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key === "/") {
      event.preventDefault();
      open();
    }
  });
};

initLab();
initLogs();
initCommandPalette();

const initXAvatar = () => {
  const img = document.querySelector("[data-x-avatar]");
  if (!img) return;

  const frame = img.closest(".hero-avatar");
  const badge = img.closest(".hero-avatar-badge");
  const candidates = [
    "https://unavatar.io/x/r3o_caffeine",
    "https://unavatar.io/twitter/r3o_caffeine",
  ];

  let idx = 0;
  const tryNext = () => {
    if (idx >= candidates.length) {
      frame?.classList.add("is-hidden");
      badge?.classList.add("is-hidden");
      return;
    }
    const url = `${candidates[idx]}?v=${Date.now()}`;
    idx += 1;
    img.src = url;
  };

  img.addEventListener("error", tryNext);
  img.addEventListener("load", () => {
    // no-op: keep the frame visible
  });

  tryNext();
};

initXAvatar();
