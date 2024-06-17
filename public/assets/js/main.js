!(function () {
  "use strict";
  let e = (e, t = !1) =>
      ((e = e.trim()), t)
        ? [...document.querySelectorAll(e)]
        : document.querySelector(e),
    t = (t, l, a, o = !1) => {
      o
        ? e(l, o).forEach((e) => e.addEventListener(t, a))
        : e(l, o).addEventListener(t, a);
    },
    l = (e, t) => {
      e.addEventListener("scroll", t);
    };
  e(".toggle-sidebar-btn") &&
    t("click", ".toggle-sidebar-btn", function (t) {
      e("body").classList.toggle("toggle-sidebar");
    }),
    e(".search-bar-toggle") &&
      t("click", ".search-bar-toggle", function (t) {
        e(".search-bar").classList.toggle("search-bar-show");
      });
  let a = e("#navbar .scrollto", !0),
    o = () => {
      let t = window.scrollY + 200;
      a.forEach((l) => {
        if (!l.hash) return;
        let a = e(l.hash);
        a &&
          (t >= a.offsetTop && t <= a.offsetTop + a.offsetHeight
            ? l.classList.add("active")
            : l.classList.remove("active"));
      });
    };
  window.addEventListener("load", o), l(document, o);
  let i = e("#header");
  if (i) {
    let s = () => {
      window.scrollY > 100
        ? i.classList.add("header-scrolled")
        : i.classList.remove("header-scrolled");
    };
    window.addEventListener("load", s), l(document, s);
  }
  let r = e(".back-to-top");
  if (r) {
    let c = () => {
      window.scrollY > 100
        ? r.classList.add("active")
        : r.classList.remove("active");
    };
    window.addEventListener("load", c), l(document, c);
  }
  [].slice
    .call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map(function (e) {
      return new bootstrap.Tooltip(e);
    }),
    e(".quill-editor-default") &&
      new Quill(".quill-editor-default", { theme: "snow" }),
    e(".quill-editor-bubble") &&
      new Quill(".quill-editor-bubble", { theme: "bubble" }),
    e(".quill-editor-full") &&
      new Quill(".quill-editor-full", {
        modules: {
          toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "super" }, { script: "sub" }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["direction", { align: [] }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
        theme: "snow",
      });
  let n = window.matchMedia("(prefers-color-scheme: dark)").matches;
  window.matchMedia("(max-width: 1023.5px)").matches;
  var d = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(d).forEach(function (e) {
    e.addEventListener(
      "submit",
      function (t) {
        e.checkValidity() || (t.preventDefault(), t.stopPropagation()),
          e.classList.add("was-validated");
      },
      !1
    );
  });
  let u = e(".datatable", !0);
  u.forEach((e) => {
    new simpleDatatables.DataTable(e, {
      perPageSelect: [5, 10, 15, ["All", -1]],
      columns: [
        { select: 2, sortSequence: ["desc", "asc"] },
        { select: 3, sortSequence: ["desc"] },
        { select: 4, cellClass: "green", headerClass: "red" },
      ],
    });
  });
  let m = e("#main");
  m &&
    setTimeout(() => {
      new ResizeObserver(function () {
        e(".echart", !0).forEach((e) => {
          echarts.getInstanceByDom(e).resize();
        });
      }).observe(m);
    }, 200);
})();
