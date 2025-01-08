const basketStepOne = document.querySelector(".step-one"),
    basketStepTwo = document.querySelector(".step-two"),
    cartEmptyBanner = document.querySelector(".cart-empty"),
    servicesToggles = document.querySelectorAll(".product__toggle"),
    basketCounters = document.querySelectorAll(".button_cart_counter"),
    basketContent = basketStepOne.querySelector(".basket-content__product");
function setEmptyBasket() {
    basketStepOne.classList.add("hidden"), cartEmptyBanner.classList.remove("hidden");
}
function setFullBasket() {
    basketStepOne.classList.remove("hidden"), cartEmptyBanner.classList.add("hidden");
}
function disableToggle(t) {
    t.querySelector(".toggle").classList.remove("check"), (t.querySelector('[type="checkbox"]').checked = !1), t.querySelector(".product__toggle_check").classList.add("d-none");
}
function enableToggle(t) {
    t.querySelector(".toggle").classList.add("check"), (t.querySelector('[type="checkbox"]').checked = !0), t.querySelector(".product__toggle_check").classList.remove("d-none");
}
function toggleClick(t) {
    let e = t.getAttribute("data-item-id"),
        s = t.querySelector('[type="checkbox"]').checked;
    if (e) {
        let t = document.querySelectorAll(`.product__toggle[data-item-id="${e}"]`);
        s ? t.forEach((t) => enableToggle(t)) : (e && deleteMods(e), t.forEach((t) => disableToggle(t)));
    } else s ? enableToggle(t) : disableToggle(t);
}
basketStepTwo.querySelector("form").addEventListener("submit", () => {
    basketStepOne.classList.remove("hidden"), basketStepTwo.classList.add("hidden"), setBasketCount(0), deleteCartNodes();
});
for (let t of servicesToggles) t.querySelector('[type="checkbox"]').onchange = () => toggleClick(t);
function deleteCartNodes() {
    document.querySelectorAll(".basket-content__product-mini").forEach((t) => {
        deleteProductOnSiteFormCart(t.getAttribute("data-item-id")), t.remove();
    });
}
function setBasketCount(t) {
    basketCounters.forEach((e) => {
        e.innerText = t;
    }),
        0 === t ? setEmptyBasket() : setFullBasket();
}
function deleteMods(t) {
    fetch(window.isteels.changeCartUrl, { method: "POST", credentials: "same-origin", headers: { "X-CSRFToken": window.isteels.csrfToken }, body: JSON.stringify({ type: "mods_clear", cart_id: t }) })
        .then((t) => t.json())
        .then((e) => {
            document.querySelectorAll(`.product__toggle[data-item-id="${t}"]`).forEach((t) => {
                t.querySelector(".toggle").classList.remove("check"), t.querySelector(".product__toggle_check").classList.add("d-none");
            });
        });
}
function product_add_cart(t, e, s = []) {
    fetch(window.isteels.addProductUrl, { method: "POST", credentials: "same-origin", headers: { "X-CSRFToken": window.isteels.csrfToken }, body: JSON.stringify({ id: t, mods: s }) })
        .then((t) => t.json())
        .then((t) => {
            e && e.setAttribute("data-item-id", t.item_id);
            let s = !!t.mods_available.length,
                i = t.mods_available,
                a = !!t.mods_selected.length,
                n = t.mods_selected,
                r = "";
            if (s) {
                r = `\n                        <div class="basket-content__product-mini-line-2 product__toggle" data-item-id="${t.item_id}">\n                            <div class="toggle${
                    a ? " check" : ""
                }">\n                                <label for="${t.item_id}"></label>\n                                <input type="checkbox" name="${t.item_id}" id="${t.item_id}" ${
                    a ? " checked" : ""
                } data-mod="true">\n                                <label class="toggle_label" for="${t.item_id}">Добавить услугу</label>\n                            </div>\n                        <div class="product__toggle_check${
                    a ? "" : " d-none"
                }">\n                    `;
                for (let t of i)
                    r += `\n                            <label class="checkbox">\n                                <input class="checkbox__input" data-mod-id="${t.id}" type="checkbox"\n                                ${
                        n.includes(t.id) ? " checked" : ""
                    }>\n                                <span class="checkbox__box"></span>\n                                <div class="checkbox__text">${t.name}</div>\n                            </label>\n                        `;
                r += "</div></div>";
            }
            setBasketCount(t.new_cart_count);
            let u = `\n                        <div class="basket-content__product-mini basket-content__product-mini-specify" data-item-id="${t.item_id}" id="cart-item-${t.item_id}">\n                            <div class="basket-content__product-mini-line-1 d-flex justify-content-between">\n                                <a href="/product/${t.product_slug}/">\n                                    <div class="basket-content__product-mini-title">\n                                        ${t.product_name}\n                                    </div>\n                                </a>\n                            </div>\n                            ${r}\n                            <div class="basket-content__product-mini-line-3 d-flex justify-content-between">\n                                <button class="btn-reset remove-product-btn">\n                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"\n                                         fill="none">\n                                        <path d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"\n                                              fill="#9DA1A6"></path>\n                                    </svg>\n                                </button>\n   <input class="basket-content__quantity-inp" type="text"\n                                       name="product-quantity" placeholder="Введите количество" inputmode="numeric">                          </div>\n                        </div>\n                    `;
            (basketContent.innerHTML += u), setBasketModalHandlers(t.item);
        });
}
function delete_cart_item(t, e) {
    fetch(window.isteels.changeCartUrl, { method: "POST", credentials: "same-origin", headers: { "X-CSRFToken": window.isteels.csrfToken }, body: JSON.stringify({ type: "delete", cart_id: t }) })
        .then((t) => t.json())
        .then((s) => {
            e && e.removeAttribute("data-item-id"), setBasketCount(s.new_cart_count), deleteProductOnSiteFormCart(t), document.getElementById(`cart-item-${t}`).remove();
        });
}
function clear_cart_items(t) {
    fetch(window.isteels.changeCartUrl, { method: "POST", credentials: "same-origin", headers: { "X-CSRFToken": window.isteels.csrfToken }, body: JSON.stringify({ clear_all: !0 }) })
        .then((t) => t.json())
        .then((t) => {
            setBasketCount(0), setEmptyBasket(), deleteCartNodes();
        });
}
function setForms() {
    document.querySelectorAll("form").forEach((t) => {
        t.getAttribute("data-action") && (t.setAttribute("action", t.getAttribute("data-action")), t.removeAttribute("data-action"));
        let e = t.querySelector('[name="email"]');
        e && (e.setAttribute("maxlength", "100"), e.setAttribute("pattern", "^([A-z0-9_-]+.)*[A-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$"));
        let s = t.querySelector('[name="phone"]');
        s && (s.setAttribute("maxlength", "21"), s.hasAttribute("placeholder") || s.setAttribute("placeholder", window.isteels.phone_placeholder));
        let i = t.querySelector('[name="fio"]');
        i && (i.setAttribute("maxlength", "100"), i.setAttribute("pattern", "(^[а-яА-ЯёЁa-zA-Z]+ ?[а-яА-ЯёЁa-zA-Z]* ?[а-яА-ЯёЁa-zA-Z]*)?$"));
    });
}
function updateItemNumber(t, e) {
    fetch(window.isteels.changeCartUrl, { method: "POST", credentials: "same-origin", headers: { "X-CSRFToken": window.isteels.csrfToken }, body: JSON.stringify({ type: "number", value: e, cart_id: t }) })
        .then((t) => t.json())
        .then((t) => {
            setBasketCount(t.new_cart_count);
        });
}
function setBasketModalHandlers(t = null) {
    let e;
    e = t ? document.querySelectorAll(`.basket-content__product-mini-specify[data-item-id="${t}"]`) : document.querySelectorAll(".basket-content__product-mini-specify");
    for (let t of e) {
        let e = t.getAttribute("data-item-id"),
            s = t.querySelector("input");
        (s.oninput = function () {
            updateItemNumber(e, s.value);
        }),
            (t.querySelector(".remove-product-btn").onclick = () => {
                delete_cart_item(e, t), deleteProductOnSiteFormCart(e);
            });
        let i = [],
            a = t.querySelector(".product__toggle");
        a &&
            ((a.querySelector('[type="checkbox"]').onchange = () => toggleClick(a)),
            t.querySelectorAll("[data-mod-id]").forEach((t) => {
                t.hasAttribute("checked") && i.push(t.getAttribute("data-mod-id")),
                    t.addEventListener("input", (s) => {
                        let a = s.currentTarget.hasAttribute("checked"),
                            n = { type: "mod", cart_id: e, mod_id: t.getAttribute("data-mod-id"), state: !1 };
                        a
                            ? (i.splice(i.indexOf(t.getAttribute("data-mod-id")), 1),
                              document.querySelectorAll(`[data-mod-id="${t.getAttribute("data-mod-id")}"]`).forEach((t) => {
                                  t.removeAttribute("checked");
                              }))
                            : (i.push(t.getAttribute("data-mod-id")),
                              document.querySelectorAll(`[data-mod-id="${t.getAttribute("data-mod-id")}"]`).forEach((t) => {
                                  t.setAttribute("checked", "checked");
                              }),
                              (n.state = !0)),
                            fetch(window.isteels.changeCartUrl, { method: "POST", credentials: "same-origin", headers: { "X-CSRFToken": window.isteels.csrfToken }, body: JSON.stringify(n) });
                    });
            }));
    }
}
function clickButtonDelete(t) {
    let e = t.currentTarget.parentElement;
    e.classList.remove("product-added"), delete_cart_item(e.getAttribute("data-item-id"), e);
}
function clickButtonAdd(t) {
    let e = t.currentTarget.parentElement;
    product_add_cart(e.getAttribute("data-product-id"), e), e.classList.add("product-added"), ym(window.isteels.ym_id, "reachGoal", "click_listing_buy");
}
function clickButtonDeleteSlider(t) {
    let e = t.currentTarget;
    e.setAttribute("data-call-modal", "cart"), e.classList.remove("btn-slide_complited", "btn-slide_active"), delete_cart_item(e.getAttribute("data-item-id"), e);
}
function clickButtonAddSlider(t) {
    let e = t.currentTarget;
    e.removeAttribute("data-call-modal"), product_add_cart(e.getAttribute("data-product-id"), e), e.classList.add("btn-slide_complited", "btn-slide_active"), ym(window.isteels.ym_id, "reachGoal", "click_product_buy");
}
function deleteProductOnSiteFormCart(t) {
    let e = document.querySelectorAll(`.product-table__buy[data-item-id="${t}"]`),
        s = document.querySelectorAll(`.sentence-card__add[data-item-id="${t}"]`),
        i = document.querySelectorAll(`.add-to-cart-btn[data-item-id="${t}"]`),
        serviceCart = document.querySelector(".service-details .order-btn");
    e.forEach((t) => {
        t.removeAttribute("data-item-id"), t.classList.remove("product-added");
    }),
        s.forEach((t) => {
            t.removeAttribute("data-item-id"), t.classList.remove("btn-slide_complited", "btn-slide_active");
        }),
        i.forEach((t) => {
            t.removeAttribute("data-item-id"), t.classList.remove("product-added");
        }),
        document.querySelectorAll(`.product__toggle[data-item-id="${t}"]`).forEach((t) => disableToggle(t));
    if (serviceCart) {
        serviceCartButton.removeAttribute("data-item-id");
        serviceCartButton.classList.remove("incart");
    }
}
function maskPhone() {
    const t = document.querySelectorAll('input[name="phone"]');
    t.length &&
        t.forEach((t) => {
            IMask(t, {
                mask: window.isteels.phoneMask,
                prepare: function (t, e) {
                    return "8" === t && "" === e.value ? "" : t;
                },
            });
        });
}
setForms(),
    document.querySelectorAll(".number").forEach((t) => {
        let e = t.querySelector("input"),
            s = t.querySelector(".number__itnus"),
            i = t.querySelector(".number__plus"),
            a = e.getAttribute("data-item-id");
        (s.onclick = function () {
            if (parseInt(e.value) > 1) {
                let t = parseInt(e.value) - 1;
                (e.value = t.toString()), updateItemNumber(a, t);
            }
        }),
            (i.onclick = function () {
                let t = parseInt(e.value) + 1;
                (e.value = t.toString()), updateItemNumber(a, t);
            });
    }),
    setBasketModalHandlers(),
    document.querySelectorAll(".product-table__buy").forEach((t) => {
        t.hasAttribute("data-item-id") && t.classList.add("product-added");
    }),
    document.querySelectorAll(".sentence-card__add").forEach((t) => {
        t.hasAttribute("data-item-id") && (t.removeAttribute("data-call-modal"), t.classList.add("btn-slide_complited", "btn-slide_active")),
            t.addEventListener("click", (e) => {
                t.hasAttribute("data-item-id") ? clickButtonDeleteSlider(e) : clickButtonAddSlider(e);
            });
    }),
    maskPhone();
const forms = document.querySelectorAll("form");
if (
    (forms?.forEach((t) => {
        const e = t.querySelector('[name="phone"]'),
            s = t.querySelector('[name="email"]'),
            i = [e, s];
        e &&
            s &&
            i?.forEach((t) => {
                t.addEventListener("input", () => {
                    s.value || ((e.required = !0), (s.required = !1)), e.value || ((s.required = !0), (e.required = !1)), e.value || s.value || ((e.required = !0), (s.required = !1));
                });
            });
    }),
    1 !== window.isteels.siteId)
) {
    const e = { lang: "ru" };
    function TranslateWidgetIsLoaded() {
        TranslateInit(e);
    }
    function TranslateInit(t) {
        t.langFirstVisit && !Cookies.get("googtrans", { domain: window.location.domain }) && TranslateCookieHandler("/auto/" + t.langFirstVisit),
            TranslateHtmlHandler(TranslateGetCode(t)),
            "ru" !== TranslateGetCode(t) && new google.translate.TranslateElement({ pageLanguage: t.lang, multilanguagePage: !0 }),
            TranslateEventHandler("click", "[data-google-lang]", function (e) {
                TranslateCookieHandler("/" + t.lang + "/" + e.getAttribute("data-google-lang"), t.domain), window.location.reload();
            });
    }
    function TranslateGetCode(t) {
        return (null != Cookies.get("googtrans", { domain: window.location.domain }) && "null" != Cookies.get("googtrans", { domain: window.location.domain }) ? Cookies.get("googtrans", { domain: window.location.domain }) : t.lang).match(
            /(?!^\/)[^\/]*$/gm
        )[0];
    }
    function TranslateCookieHandler(t, e) {
        Cookies.remove("googtrans"), Cookies.remove("googtrans", { domain: window.location.domain }), Cookies.remove("googtrans", { domain: ".isteels.ru" }), Cookies.set("googtrans", t);
    }
    function TranslateEventHandler(t, e, s) {
        document.addEventListener(t, function (t) {
            let i = t.target.closest(e);
            i && s(i);
        });
    }
    function TranslateHtmlHandler(t) {
        if (null !== document.querySelector(`[data-google-lang="${t}"]`)) {
            const e = document.querySelector(".js-language-title");
            document.querySelector('[data-google-lang="' + t + '"]'), document.querySelector(`.${t}`).classList.add("active-language-icon"), (e.innerText = t.toUpperCase());
        }
    }
    document.addEventListener("DOMContentLoaded", (t) => {
        let e = document.createElement("script");
        (e.src = "//translate.google.com/translate_a/element.js?cb=TranslateWidgetIsLoaded"), document.getElementsByTagName("head")[0].appendChild(e);
    });
}
(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(((t = "undefined" != typeof globalThis ? globalThis : t || self).IMask = {}));
})(this, function (t) {
    "use strict";
    function e(t) {
        return "string" == typeof t || t instanceof String;
    }
    function s(t) {
        var e;
        return "object" == typeof t && null != t && "Object" === (null == t || null == (e = t.constructor) ? void 0 : e.name);
    }
    function i(t, e) {
        return Array.isArray(e)
            ? i(t, (t, s) => e.includes(s))
            : Object.entries(t).reduce((t, s) => {
                  let [i, a] = s;
                  return e(a, i) && (t[i] = a), t;
              }, {});
    }
    const a = { NONE: "NONE", LEFT: "LEFT", FORCE_LEFT: "FORCE_LEFT", RIGHT: "RIGHT", FORCE_RIGHT: "FORCE_RIGHT" };
    function n(t) {
        switch (t) {
            case a.LEFT:
                return a.FORCE_LEFT;
            case a.RIGHT:
                return a.FORCE_RIGHT;
            default:
                return t;
        }
    }
    function r(t) {
        return t.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    }
    function u(t, e) {
        if (e === t) return !0;
        const s = Array.isArray(e),
            i = Array.isArray(t);
        let a;
        if (s && i) {
            if (e.length != t.length) return !1;
            for (a = 0; a < e.length; a++) if (!u(e[a], t[a])) return !1;
            return !0;
        }
        if (s != i) return !1;
        if (e && t && "object" == typeof e && "object" == typeof t) {
            const s = e instanceof Date,
                i = t instanceof Date;
            if (s && i) return e.getTime() == t.getTime();
            if (s != i) return !1;
            const n = e instanceof RegExp,
                r = t instanceof RegExp;
            if (n && r) return e.toString() == t.toString();
            if (n != r) return !1;
            const o = Object.keys(e);
            for (a = 0; a < o.length; a++) if (!Object.prototype.hasOwnProperty.call(t, o[a])) return !1;
            for (a = 0; a < o.length; a++) if (!u(t[o[a]], e[o[a]])) return !1;
            return !0;
        }
        return !(!e || !t || "function" != typeof e || "function" != typeof t) && e.toString() === t.toString();
    }
    class o {
        constructor(t) {
            for (Object.assign(this, t); this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos); ) --this.oldSelection.start;
            for (; this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end); ) this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end ? ++this.oldSelection.end : ++this.cursorPos;
        }
        get startChangePos() {
            return Math.min(this.cursorPos, this.oldSelection.start);
        }
        get insertedCount() {
            return this.cursorPos - this.startChangePos;
        }
        get inserted() {
            return this.value.substr(this.startChangePos, this.insertedCount);
        }
        get removedCount() {
            return Math.max(this.oldSelection.end - this.startChangePos || this.oldValue.length - this.value.length, 0);
        }
        get removed() {
            return this.oldValue.substr(this.startChangePos, this.removedCount);
        }
        get head() {
            return this.value.substring(0, this.startChangePos);
        }
        get tail() {
            return this.value.substring(this.startChangePos + this.insertedCount);
        }
        get removeDirection() {
            return !this.removedCount || this.insertedCount ? a.NONE : (this.oldSelection.end !== this.cursorPos && this.oldSelection.start !== this.cursorPos) || this.oldSelection.end !== this.oldSelection.start ? a.LEFT : a.RIGHT;
        }
    }
    function l(t, e) {
        return new l.InputMask(t, e);
    }
    function h(t) {
        if (null == t) throw new Error("mask property should be defined");
        return t instanceof RegExp
            ? l.MaskedRegExp
            : e(t)
            ? l.MaskedPattern
            : t === Date
            ? l.MaskedDate
            : t === Number
            ? l.MaskedNumber
            : Array.isArray(t) || t === Array
            ? l.MaskedDynamic
            : l.Masked && t.prototype instanceof l.Masked
            ? t
            : l.Masked && t instanceof l.Masked
            ? t.constructor
            : t instanceof Function
            ? l.MaskedFunction
            : (console.warn("Mask not found for mask", t), l.Masked);
    }
    function d(t) {
        if (!t) throw new Error("Options in not defined");
        if (l.Masked) {
            if (t.prototype instanceof l.Masked) return { mask: t };
            const { mask: e, ...a } = t instanceof l.Masked ? { mask: t } : s(t) && t.mask instanceof l.Masked ? t : {};
            if (e) {
                const t = e.mask;
                return { ...i(e, (t, e) => !e.startsWith("_")), mask: e.constructor, _mask: t, ...a };
            }
        }
        return s(t) ? { ...t } : { mask: t };
    }
    function c(t) {
        if (l.Masked && t instanceof l.Masked) return t;
        const e = d(t),
            s = h(e.mask);
        if (!s) throw new Error("Masked class is not found for provided mask " + e.mask + ", appropriate module needs to be imported manually before creating mask.");
        return e.mask === s && delete e.mask, e._mask && ((e.mask = e._mask), delete e._mask), new s(e);
    }
    l.createMask = c;
    class p {
        get selectionStart() {
            let t;
            try {
                t = this._unsafeSelectionStart;
            } catch {}
            return null != t ? t : this.value.length;
        }
        get selectionEnd() {
            let t;
            try {
                t = this._unsafeSelectionEnd;
            } catch {}
            return null != t ? t : this.value.length;
        }
        select(t, e) {
            if (null != t && null != e && (t !== this.selectionStart || e !== this.selectionEnd))
                try {
                    this._unsafeSelect(t, e);
                } catch {}
        }
        get isActive() {
            return !1;
        }
    }
    l.MaskElement = p;
    class g extends p {
        constructor(t) {
            super(),
                (this.input = t),
                (this._onKeydown = this._onKeydown.bind(this)),
                (this._onInput = this._onInput.bind(this)),
                (this._onBeforeinput = this._onBeforeinput.bind(this)),
                (this._onCompositionEnd = this._onCompositionEnd.bind(this));
        }
        get rootElement() {
            var t, e, s;
            return null != (t = null == (e = (s = this.input).getRootNode) ? void 0 : e.call(s)) ? t : document;
        }
        get isActive() {
            return this.input === this.rootElement.activeElement;
        }
        bindEvents(t) {
            this.input.addEventListener("keydown", this._onKeydown),
                this.input.addEventListener("input", this._onInput),
                this.input.addEventListener("beforeinput", this._onBeforeinput),
                this.input.addEventListener("compositionend", this._onCompositionEnd),
                this.input.addEventListener("drop", t.drop),
                this.input.addEventListener("click", t.click),
                this.input.addEventListener("focus", t.focus),
                this.input.addEventListener("blur", t.commit),
                (this._handlers = t);
        }
        _onKeydown(t) {
            return this._handlers.redo && ((90 === t.keyCode && t.shiftKey && (t.metaKey || t.ctrlKey)) || (89 === t.keyCode && t.ctrlKey))
                ? (t.preventDefault(), this._handlers.redo(t))
                : this._handlers.undo && 90 === t.keyCode && (t.metaKey || t.ctrlKey)
                ? (t.preventDefault(), this._handlers.undo(t))
                : void (t.isComposing || this._handlers.selectionChange(t));
        }
        _onBeforeinput(t) {
            return "historyUndo" === t.inputType && this._handlers.undo ? (t.preventDefault(), this._handlers.undo(t)) : "historyRedo" === t.inputType && this._handlers.redo ? (t.preventDefault(), this._handlers.redo(t)) : void 0;
        }
        _onCompositionEnd(t) {
            this._handlers.input(t);
        }
        _onInput(t) {
            t.isComposing || this._handlers.input(t);
        }
        unbindEvents() {
            this.input.removeEventListener("keydown", this._onKeydown),
                this.input.removeEventListener("input", this._onInput),
                this.input.removeEventListener("beforeinput", this._onBeforeinput),
                this.input.removeEventListener("compositionend", this._onCompositionEnd),
                this.input.removeEventListener("drop", this._handlers.drop),
                this.input.removeEventListener("click", this._handlers.click),
                this.input.removeEventListener("focus", this._handlers.focus),
                this.input.removeEventListener("blur", this._handlers.commit),
                (this._handlers = {});
        }
    }
    l.HTMLMaskElement = g;
    class m extends g {
        constructor(t) {
            super(t), (this.input = t);
        }
        get _unsafeSelectionStart() {
            return null != this.input.selectionStart ? this.input.selectionStart : this.value.length;
        }
        get _unsafeSelectionEnd() {
            return this.input.selectionEnd;
        }
        _unsafeSelect(t, e) {
            this.input.setSelectionRange(t, e);
        }
        get value() {
            return this.input.value;
        }
        set value(t) {
            this.input.value = t;
        }
    }
    l.HTMLMaskElement = g;
    class k extends g {
        get _unsafeSelectionStart() {
            const t = this.rootElement,
                e = t.getSelection && t.getSelection(),
                s = e && e.anchorOffset,
                i = e && e.focusOffset;
            return null == i || null == s || s < i ? s : i;
        }
        get _unsafeSelectionEnd() {
            const t = this.rootElement,
                e = t.getSelection && t.getSelection(),
                s = e && e.anchorOffset,
                i = e && e.focusOffset;
            return null == i || null == s || s > i ? s : i;
        }
        _unsafeSelect(t, e) {
            if (!this.rootElement.createRange) return;
            const s = this.rootElement.createRange();
            s.setStart(this.input.firstChild || this.input, t), s.setEnd(this.input.lastChild || this.input, e);
            const i = this.rootElement,
                a = i.getSelection && i.getSelection();
            a && (a.removeAllRanges(), a.addRange(s));
        }
        get value() {
            return this.input.textContent || "";
        }
        set value(t) {
            this.input.textContent = t;
        }
    }
    l.HTMLContenteditableMaskElement = k;
    class f {
        constructor() {
            (this.states = []), (this.currentIndex = 0);
        }
        get currentState() {
            return this.states[this.currentIndex];
        }
        get isEmpty() {
            return 0 === this.states.length;
        }
        push(t) {
            this.currentIndex < this.states.length - 1 && (this.states.length = this.currentIndex + 1), this.states.push(t), this.states.length > f.MAX_LENGTH && this.states.shift(), (this.currentIndex = this.states.length - 1);
        }
        go(t) {
            return (this.currentIndex = Math.min(Math.max(this.currentIndex + t, 0), this.states.length - 1)), this.currentState;
        }
        undo() {
            return this.go(-1);
        }
        redo() {
            return this.go(1);
        }
        clear() {
            (this.states.length = 0), (this.currentIndex = 0);
        }
    }
    f.MAX_LENGTH = 100;
    class _ {
        constructor(t, e) {
            (this.el = t instanceof p ? t : t.isContentEditable && "INPUT" !== t.tagName && "TEXTAREA" !== t.tagName ? new k(t) : new m(t)),
                (this.masked = c(e)),
                (this._listeners = {}),
                (this._value = ""),
                (this._unmaskedValue = ""),
                (this._rawInputValue = ""),
                (this.history = new f()),
                (this._saveSelection = this._saveSelection.bind(this)),
                (this._onInput = this._onInput.bind(this)),
                (this._onChange = this._onChange.bind(this)),
                (this._onDrop = this._onDrop.bind(this)),
                (this._onFocus = this._onFocus.bind(this)),
                (this._onClick = this._onClick.bind(this)),
                (this._onUndo = this._onUndo.bind(this)),
                (this._onRedo = this._onRedo.bind(this)),
                (this.alignCursor = this.alignCursor.bind(this)),
                (this.alignCursorFriendly = this.alignCursorFriendly.bind(this)),
                this._bindEvents(),
                this.updateValue(),
                this._onChange();
        }
        maskEquals(t) {
            var e;
            return null == t || (null == (e = this.masked) ? void 0 : e.maskEquals(t));
        }
        get mask() {
            return this.masked.mask;
        }
        set mask(t) {
            if (this.maskEquals(t)) return;
            if (!(t instanceof l.Masked) && this.masked.constructor === h(t)) return void this.masked.updateOptions({ mask: t });
            const e = t instanceof l.Masked ? t : c({ mask: t });
            (e.unmaskedValue = this.masked.unmaskedValue), (this.masked = e);
        }
        get value() {
            return this._value;
        }
        set value(t) {
            this.value !== t && ((this.masked.value = t), this.updateControl("auto"));
        }
        get unmaskedValue() {
            return this._unmaskedValue;
        }
        set unmaskedValue(t) {
            this.unmaskedValue !== t && ((this.masked.unmaskedValue = t), this.updateControl("auto"));
        }
        get rawInputValue() {
            return this._rawInputValue;
        }
        set rawInputValue(t) {
            this.rawInputValue !== t && ((this.masked.rawInputValue = t), this.updateControl(), this.alignCursor());
        }
        get typedValue() {
            return this.masked.typedValue;
        }
        set typedValue(t) {
            this.masked.typedValueEquals(t) || ((this.masked.typedValue = t), this.updateControl("auto"));
        }
        get displayValue() {
            return this.masked.displayValue;
        }
        _bindEvents() {
            this.el.bindEvents({ selectionChange: this._saveSelection, input: this._onInput, drop: this._onDrop, click: this._onClick, focus: this._onFocus, commit: this._onChange, undo: this._onUndo, redo: this._onRedo });
        }
        _unbindEvents() {
            this.el && this.el.unbindEvents();
        }
        _fireEvent(t, e) {
            const s = this._listeners[t];
            s && s.forEach((t) => t(e));
        }
        get selectionStart() {
            return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
        }
        get cursorPos() {
            return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
        }
        set cursorPos(t) {
            this.el && this.el.isActive && (this.el.select(t, t), this._saveSelection());
        }
        _saveSelection() {
            this.displayValue !== this.el.value && console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly."),
                (this._selection = { start: this.selectionStart, end: this.cursorPos });
        }
        updateValue() {
            (this.masked.value = this.el.value), (this._value = this.masked.value);
        }
        updateControl(t) {
            const e = this.masked.unmaskedValue,
                s = this.masked.value,
                i = this.masked.rawInputValue,
                a = this.displayValue,
                n = this.unmaskedValue !== e || this.value !== s || this._rawInputValue !== i;
            (this._unmaskedValue = e),
                (this._value = s),
                (this._rawInputValue = i),
                this.el.value !== a && (this.el.value = a),
                "auto" === t ? this.alignCursor() : null != t && (this.cursorPos = t),
                n && this._fireChangeEvents(),
                this._historyChanging || (!n && !this.history.isEmpty) || this.history.push({ unmaskedValue: e, selection: { start: this.selectionStart, end: this.cursorPos } });
        }
        updateOptions(t) {
            const { mask: e, ...s } = t,
                i = !this.maskEquals(e),
                a = this.masked.optionsIsChanged(s);
            i && (this.mask = e), a && this.masked.updateOptions(s), (i || a) && this.updateControl();
        }
        updateCursor(t) {
            null != t && ((this.cursorPos = t), this._delayUpdateCursor(t));
        }
        _delayUpdateCursor(t) {
            this._abortUpdateCursor(),
                (this._changingCursorPos = t),
                (this._cursorChanging = setTimeout(() => {
                    this.el && ((this.cursorPos = this._changingCursorPos), this._abortUpdateCursor());
                }, 10));
        }
        _fireChangeEvents() {
            this._fireEvent("accept", this._inputEvent), this.masked.isComplete && this._fireEvent("complete", this._inputEvent);
        }
        _abortUpdateCursor() {
            this._cursorChanging && (clearTimeout(this._cursorChanging), delete this._cursorChanging);
        }
        alignCursor() {
            this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, a.LEFT));
        }
        alignCursorFriendly() {
            this.selectionStart === this.cursorPos && this.alignCursor();
        }
        on(t, e) {
            return this._listeners[t] || (this._listeners[t] = []), this._listeners[t].push(e), this;
        }
        off(t, e) {
            if (!this._listeners[t]) return this;
            if (!e) return delete this._listeners[t], this;
            const s = this._listeners[t].indexOf(e);
            return s >= 0 && this._listeners[t].splice(s, 1), this;
        }
        _onInput(t) {
            (this._inputEvent = t), this._abortUpdateCursor();
            const e = new o({ value: this.el.value, cursorPos: this.cursorPos, oldValue: this.displayValue, oldSelection: this._selection }),
                s = this.masked.rawInputValue,
                i = this.masked.splice(e.startChangePos, e.removed.length, e.inserted, e.removeDirection, { input: !0, raw: !0 }).offset,
                n = s === this.masked.rawInputValue ? e.removeDirection : a.NONE;
            let r = this.masked.nearestInputPos(e.startChangePos + i, n);
            n !== a.NONE && (r = this.masked.nearestInputPos(r, a.NONE)), this.updateControl(r), delete this._inputEvent;
        }
        _onChange() {
            this.displayValue !== this.el.value && this.updateValue(), this.masked.doCommit(), this.updateControl(), this._saveSelection();
        }
        _onDrop(t) {
            t.preventDefault(), t.stopPropagation();
        }
        _onFocus(t) {
            this.alignCursorFriendly();
        }
        _onClick(t) {
            this.alignCursorFriendly();
        }
        _onUndo() {
            this._applyHistoryState(this.history.undo());
        }
        _onRedo() {
            this._applyHistoryState(this.history.redo());
        }
        _applyHistoryState(t) {
            t && ((this._historyChanging = !0), (this.unmaskedValue = t.unmaskedValue), this.el.select(t.selection.start, t.selection.end), this._saveSelection(), (this._historyChanging = !1));
        }
        destroy() {
            this._unbindEvents(), (this._listeners.length = 0), delete this.el;
        }
    }
    l.InputMask = _;
    class v {
        static normalize(t) {
            return Array.isArray(t) ? t : [t, new v()];
        }
        constructor(t) {
            Object.assign(this, { inserted: "", rawInserted: "", tailShift: 0, skip: !1 }, t);
        }
        aggregate(t) {
            return (this.inserted += t.inserted), (this.rawInserted += t.rawInserted), (this.tailShift += t.tailShift), (this.skip = this.skip || t.skip), this;
        }
        get offset() {
            return this.tailShift + this.inserted.length;
        }
        get consumed() {
            return Boolean(this.rawInserted) || this.skip;
        }
    }
    l.ChangeDetails = v;
    class C {
        constructor(t, e, s) {
            void 0 === t && (t = ""), void 0 === e && (e = 0), (this.value = t), (this.from = e), (this.stop = s);
        }
        toString() {
            return this.value;
        }
        extend(t) {
            this.value += String(t);
        }
        appendTo(t) {
            return t.append(this.toString(), { tail: !0 }).aggregate(t._appendPlaceholder());
        }
        get state() {
            return { value: this.value, from: this.from, stop: this.stop };
        }
        set state(t) {
            Object.assign(this, t);
        }
        unshift(t) {
            if (!this.value.length || (null != t && this.from >= t)) return "";
            const e = this.value[0];
            return (this.value = this.value.slice(1)), e;
        }
        shift() {
            if (!this.value.length) return "";
            const t = this.value[this.value.length - 1];
            return (this.value = this.value.slice(0, -1)), t;
        }
    }
    class E {
        constructor(t) {
            (this._value = ""), this._update({ ...E.DEFAULTS, ...t }), (this._initialized = !0);
        }
        updateOptions(t) {
            this.optionsIsChanged(t) && this.withValueRefresh(this._update.bind(this, t));
        }
        _update(t) {
            Object.assign(this, t);
        }
        get state() {
            return { _value: this.value, _rawInputValue: this.rawInputValue };
        }
        set state(t) {
            this._value = t._value;
        }
        reset() {
            this._value = "";
        }
        get value() {
            return this._value;
        }
        set value(t) {
            this.resolve(t, { input: !0 });
        }
        resolve(t, e) {
            void 0 === e && (e = { input: !0 }), this.reset(), this.append(t, e, ""), this.doCommit();
        }
        get unmaskedValue() {
            return this.value;
        }
        set unmaskedValue(t) {
            this.resolve(t, {});
        }
        get typedValue() {
            return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
        }
        set typedValue(t) {
            this.format ? (this.value = this.format(t, this)) : (this.unmaskedValue = String(t));
        }
        get rawInputValue() {
            return this.extractInput(0, this.displayValue.length, { raw: !0 });
        }
        set rawInputValue(t) {
            this.resolve(t, { raw: !0 });
        }
        get displayValue() {
            return this.value;
        }
        get isComplete() {
            return !0;
        }
        get isFilled() {
            return this.isComplete;
        }
        nearestInputPos(t, e) {
            return t;
        }
        totalInputPositions(t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length), Math.min(this.displayValue.length, e - t);
        }
        extractInput(t, e, s) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length), this.displayValue.slice(t, e);
        }
        extractTail(t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length), new C(this.extractInput(t, e), t);
        }
        appendTail(t) {
            return e(t) && (t = new C(String(t))), t.appendTo(this);
        }
        _appendCharRaw(t, e) {
            return t ? ((this._value += t), new v({ inserted: t, rawInserted: t })) : new v();
        }
        _appendChar(t, e, s) {
            void 0 === e && (e = {});
            const i = this.state;
            let a;
            if ((([t, a] = this.doPrepareChar(t, e)), t && (a = a.aggregate(this._appendCharRaw(t, e))), a.inserted)) {
                let t,
                    n = !1 !== this.doValidate(e);
                if (n && null != s) {
                    const e = this.state;
                    if (!0 === this.overwrite) {
                        t = s.state;
                        for (let t = 0; t < a.rawInserted.length; ++t) s.unshift(this.displayValue.length - a.tailShift);
                    }
                    let i = this.appendTail(s);
                    if (((n = i.rawInserted.length === s.toString().length), !((n && i.inserted) || "shift" !== this.overwrite))) {
                        (this.state = e), (t = s.state);
                        for (let t = 0; t < a.rawInserted.length; ++t) s.shift();
                        (i = this.appendTail(s)), (n = i.rawInserted.length === s.toString().length);
                    }
                    n && i.inserted && (this.state = e);
                }
                n || ((a = new v()), (this.state = i), s && t && (s.state = t));
            }
            return a;
        }
        _appendPlaceholder() {
            return new v();
        }
        _appendEager() {
            return new v();
        }
        append(t, s, i) {
            if (!e(t)) throw new Error("value should be string");
            const a = e(i) ? new C(String(i)) : i;
            let n;
            null != s && s.tail && (s._beforeTailState = this.state), ([t, n] = this.doPrepare(t, s));
            for (let e = 0; e < t.length; ++e) {
                const i = this._appendChar(t[e], s, a);
                if (!i.rawInserted && !this.doSkipInvalid(t[e], s, a)) break;
                n.aggregate(i);
            }
            return (!0 === this.eager || "append" === this.eager) && null != s && s.input && t && n.aggregate(this._appendEager()), null != a && (n.tailShift += this.appendTail(a).tailShift), n;
        }
        remove(t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length), (this._value = this.displayValue.slice(0, t) + this.displayValue.slice(e)), new v();
        }
        withValueRefresh(t) {
            if (this._refreshing || !this._initialized) return t();
            this._refreshing = !0;
            const e = this.rawInputValue,
                s = this.value,
                i = t();
            return (this.rawInputValue = e), this.value && this.value !== s && 0 === s.indexOf(this.value) && (this.append(s.slice(this.displayValue.length), {}, ""), this.doCommit()), delete this._refreshing, i;
        }
        runIsolated(t) {
            if (this._isolated || !this._initialized) return t(this);
            this._isolated = !0;
            const e = this.state,
                s = t(this);
            return (this.state = e), delete this._isolated, s;
        }
        doSkipInvalid(t, e, s) {
            return Boolean(this.skipInvalid);
        }
        doPrepare(t, e) {
            return void 0 === e && (e = {}), v.normalize(this.prepare ? this.prepare(t, this, e) : t);
        }
        doPrepareChar(t, e) {
            return void 0 === e && (e = {}), v.normalize(this.prepareChar ? this.prepareChar(t, this, e) : t);
        }
        doValidate(t) {
            return (!this.validate || this.validate(this.value, this, t)) && (!this.parent || this.parent.doValidate(t));
        }
        doCommit() {
            this.commit && this.commit(this.value, this);
        }
        splice(t, e, s, i, r) {
            void 0 === i && (i = a.NONE), void 0 === r && (r = { input: !0 });
            const u = t + e,
                o = this.extractTail(u),
                l = !0 === this.eager || "remove" === this.eager;
            let h;
            l && ((i = n(i)), (h = this.extractInput(0, u, { raw: !0 })));
            let d = t;
            const c = new v();
            if ((i !== a.NONE && ((d = this.nearestInputPos(t, e > 1 && 0 !== t && !l ? a.NONE : i)), (c.tailShift = d - t)), c.aggregate(this.remove(d)), l && i !== a.NONE && h === this.rawInputValue))
                if (i === a.FORCE_LEFT) {
                    let t;
                    for (; h === this.rawInputValue && (t = this.displayValue.length); ) c.aggregate(new v({ tailShift: -1 })).aggregate(this.remove(t - 1));
                } else i === a.FORCE_RIGHT && o.unshift();
            return c.aggregate(this.append(s, r, o));
        }
        maskEquals(t) {
            return this.mask === t;
        }
        optionsIsChanged(t) {
            return !u(this, t);
        }
        typedValueEquals(t) {
            const e = this.typedValue;
            return t === e || (E.EMPTY_VALUES.includes(t) && E.EMPTY_VALUES.includes(e)) || (!!this.format && this.format(t, this) === this.format(this.typedValue, this));
        }
    }
    (E.DEFAULTS = { skipInvalid: !0 }), (E.EMPTY_VALUES = [void 0, null, ""]), (l.Masked = E);
    class A {
        constructor(t, e) {
            void 0 === t && (t = []), void 0 === e && (e = 0), (this.chunks = t), (this.from = e);
        }
        toString() {
            return this.chunks.map(String).join("");
        }
        extend(t) {
            if (!String(t)) return;
            t = e(t) ? new C(String(t)) : t;
            const s = this.chunks[this.chunks.length - 1],
                i = s && (s.stop === t.stop || null == t.stop) && t.from === s.from + s.toString().length;
            if (t instanceof C) i ? s.extend(t.toString()) : this.chunks.push(t);
            else if (t instanceof A) {
                if (null == t.stop) {
                    let e;
                    for (; t.chunks.length && null == t.chunks[0].stop; ) (e = t.chunks.shift()), (e.from += t.from), this.extend(e);
                }
                t.toString() && ((t.stop = t.blockIndex), this.chunks.push(t));
            }
        }
        appendTo(t) {
            if (!(t instanceof l.MaskedPattern)) return new C(this.toString()).appendTo(t);
            const e = new v();
            for (let s = 0; s < this.chunks.length; ++s) {
                const i = this.chunks[s],
                    a = t._mapPosToBlock(t.displayValue.length),
                    n = i.stop;
                let r;
                if ((null != n && (!a || a.index <= n) && ((i instanceof A || t._stops.indexOf(n) >= 0) && e.aggregate(t._appendPlaceholder(n)), (r = i instanceof A && t._blocks[n])), r)) {
                    const s = r.appendTail(i);
                    e.aggregate(s);
                    const a = i.toString().slice(s.rawInserted.length);
                    a && e.aggregate(t.append(a, { tail: !0 }));
                } else e.aggregate(t.append(i.toString(), { tail: !0 }));
            }
            return e;
        }
        get state() {
            return { chunks: this.chunks.map((t) => t.state), from: this.from, stop: this.stop, blockIndex: this.blockIndex };
        }
        set state(t) {
            const { chunks: e, ...s } = t;
            Object.assign(this, s),
                (this.chunks = e.map((t) => {
                    const e = "chunks" in t ? new A() : new C();
                    return (e.state = t), e;
                }));
        }
        unshift(t) {
            if (!this.chunks.length || (null != t && this.from >= t)) return "";
            const e = null != t ? t - this.from : t;
            let s = 0;
            for (; s < this.chunks.length; ) {
                const t = this.chunks[s],
                    i = t.unshift(e);
                if (t.toString()) {
                    if (!i) break;
                    ++s;
                } else this.chunks.splice(s, 1);
                if (i) return i;
            }
            return "";
        }
        shift() {
            if (!this.chunks.length) return "";
            let t = this.chunks.length - 1;
            for (; 0 <= t; ) {
                const e = this.chunks[t],
                    s = e.shift();
                if (e.toString()) {
                    if (!s) break;
                    --t;
                } else this.chunks.splice(t, 1);
                if (s) return s;
            }
            return "";
        }
    }
    class b {
        constructor(t, e) {
            (this.masked = t), (this._log = []);
            const { offset: s, index: i } = t._mapPosToBlock(e) || (e < 0 ? { index: 0, offset: 0 } : { index: this.masked._blocks.length, offset: 0 });
            (this.offset = s), (this.index = i), (this.ok = !1);
        }
        get block() {
            return this.masked._blocks[this.index];
        }
        get pos() {
            return this.masked._blockStartPos(this.index) + this.offset;
        }
        get state() {
            return { index: this.index, offset: this.offset, ok: this.ok };
        }
        set state(t) {
            Object.assign(this, t);
        }
        pushState() {
            this._log.push(this.state);
        }
        popState() {
            const t = this._log.pop();
            return t && (this.state = t), t;
        }
        bindBlock() {
            this.block || (this.index < 0 && ((this.index = 0), (this.offset = 0)), this.index >= this.masked._blocks.length && ((this.index = this.masked._blocks.length - 1), (this.offset = this.block.displayValue.length)));
        }
        _pushLeft(t) {
            for (this.pushState(), this.bindBlock(); 0 <= this.index; --this.index, this.offset = (null == (e = this.block) ? void 0 : e.displayValue.length) || 0) {
                var e;
                if (t()) return (this.ok = !0);
            }
            return (this.ok = !1);
        }
        _pushRight(t) {
            for (this.pushState(), this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) if (t()) return (this.ok = !0);
            return (this.ok = !1);
        }
        pushLeftBeforeFilled() {
            return this._pushLeft(() => {
                if (!this.block.isFixed && this.block.value) return (this.offset = this.block.nearestInputPos(this.offset, a.FORCE_LEFT)), 0 !== this.offset || void 0;
            });
        }
        pushLeftBeforeInput() {
            return this._pushLeft(() => {
                if (!this.block.isFixed) return (this.offset = this.block.nearestInputPos(this.offset, a.LEFT)), !0;
            });
        }
        pushLeftBeforeRequired() {
            return this._pushLeft(() => {
                if (!(this.block.isFixed || (this.block.isOptional && !this.block.value))) return (this.offset = this.block.nearestInputPos(this.offset, a.LEFT)), !0;
            });
        }
        pushRightBeforeFilled() {
            return this._pushRight(() => {
                if (!this.block.isFixed && this.block.value) return (this.offset = this.block.nearestInputPos(this.offset, a.FORCE_RIGHT)), this.offset !== this.block.value.length || void 0;
            });
        }
        pushRightBeforeInput() {
            return this._pushRight(() => {
                if (!this.block.isFixed) return (this.offset = this.block.nearestInputPos(this.offset, a.NONE)), !0;
            });
        }
        pushRightBeforeRequired() {
            return this._pushRight(() => {
                if (!(this.block.isFixed || (this.block.isOptional && !this.block.value))) return (this.offset = this.block.nearestInputPos(this.offset, a.NONE)), !0;
            });
        }
    }
    class F {
        constructor(t) {
            Object.assign(this, t), (this._value = ""), (this.isFixed = !0);
        }
        get value() {
            return this._value;
        }
        get unmaskedValue() {
            return this.isUnmasking ? this.value : "";
        }
        get rawInputValue() {
            return this._isRawInput ? this.value : "";
        }
        get displayValue() {
            return this.value;
        }
        reset() {
            (this._isRawInput = !1), (this._value = "");
        }
        remove(t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this._value.length), (this._value = this._value.slice(0, t) + this._value.slice(e)), this._value || (this._isRawInput = !1), new v();
        }
        nearestInputPos(t, e) {
            void 0 === e && (e = a.NONE);
            const s = this._value.length;
            switch (e) {
                case a.LEFT:
                case a.FORCE_LEFT:
                    return 0;
                default:
                    return s;
            }
        }
        totalInputPositions(t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this._value.length), this._isRawInput ? e - t : 0;
        }
        extractInput(t, e, s) {
            return void 0 === t && (t = 0), void 0 === e && (e = this._value.length), void 0 === s && (s = {}), (s.raw && this._isRawInput && this._value.slice(t, e)) || "";
        }
        get isComplete() {
            return !0;
        }
        get isFilled() {
            return Boolean(this._value);
        }
        _appendChar(t, e) {
            if ((void 0 === e && (e = {}), this.isFilled)) return new v();
            const s = !0 === this.eager || "append" === this.eager,
                i = this.char === t && (this.isUnmasking || e.input || e.raw) && (!e.raw || !s) && !e.tail,
                a = new v({ inserted: this.char, rawInserted: i ? this.char : "" });
            return (this._value = this.char), (this._isRawInput = i && (e.raw || e.input)), a;
        }
        _appendEager() {
            return this._appendChar(this.char, { tail: !0 });
        }
        _appendPlaceholder() {
            const t = new v();
            return this.isFilled || (this._value = t.inserted = this.char), t;
        }
        extractTail() {
            return new C("");
        }
        appendTail(t) {
            return e(t) && (t = new C(String(t))), t.appendTo(this);
        }
        append(t, e, s) {
            const i = this._appendChar(t[0], e);
            return null != s && (i.tailShift += this.appendTail(s).tailShift), i;
        }
        doCommit() {}
        get state() {
            return { _value: this._value, _rawInputValue: this.rawInputValue };
        }
        set state(t) {
            (this._value = t._value), (this._isRawInput = Boolean(t._rawInputValue));
        }
    }
    class y {
        constructor(t) {
            const { parent: e, isOptional: s, placeholderChar: i, displayChar: a, lazy: n, eager: r, ...u } = t;
            (this.masked = c(u)), Object.assign(this, { parent: e, isOptional: s, placeholderChar: i, displayChar: a, lazy: n, eager: r });
        }
        reset() {
            (this.isFilled = !1), this.masked.reset();
        }
        remove(t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.value.length), 0 === t && e >= 1 ? ((this.isFilled = !1), this.masked.remove(t, e)) : new v();
        }
        get value() {
            return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
        }
        get unmaskedValue() {
            return this.masked.unmaskedValue;
        }
        get rawInputValue() {
            return this.masked.rawInputValue;
        }
        get displayValue() {
            return (this.masked.value && this.displayChar) || this.value;
        }
        get isComplete() {
            return Boolean(this.masked.value) || this.isOptional;
        }
        _appendChar(t, e) {
            if ((void 0 === e && (e = {}), this.isFilled)) return new v();
            const s = this.masked.state;
            let i = this.masked._appendChar(t, this.currentMaskFlags(e));
            return (
                i.inserted && !1 === this.doValidate(e) && ((i = new v()), (this.masked.state = s)),
                i.inserted || this.isOptional || this.lazy || e.input || (i.inserted = this.placeholderChar),
                (i.skip = !i.inserted && !this.isOptional),
                (this.isFilled = Boolean(i.inserted)),
                i
            );
        }
        append(t, e, s) {
            return this.masked.append(t, this.currentMaskFlags(e), s);
        }
        _appendPlaceholder() {
            return this.isFilled || this.isOptional ? new v() : ((this.isFilled = !0), new v({ inserted: this.placeholderChar }));
        }
        _appendEager() {
            return new v();
        }
        extractTail(t, e) {
            return this.masked.extractTail(t, e);
        }
        appendTail(t) {
            return this.masked.appendTail(t);
        }
        extractInput(t, e, s) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.value.length), this.masked.extractInput(t, e, s);
        }
        nearestInputPos(t, e) {
            void 0 === e && (e = a.NONE);
            const s = this.value.length,
                i = Math.min(Math.max(t, 0), s);
            switch (e) {
                case a.LEFT:
                case a.FORCE_LEFT:
                    return this.isComplete ? i : 0;
                case a.RIGHT:
                case a.FORCE_RIGHT:
                    return this.isComplete ? i : s;
                default:
                    return i;
            }
        }
        totalInputPositions(t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.value.length), this.value.slice(t, e).length;
        }
        doValidate(t) {
            return this.masked.doValidate(this.currentMaskFlags(t)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(t)));
        }
        doCommit() {
            this.masked.doCommit();
        }
        get state() {
            return { _value: this.value, _rawInputValue: this.rawInputValue, masked: this.masked.state, isFilled: this.isFilled };
        }
        set state(t) {
            (this.masked.state = t.masked), (this.isFilled = t.isFilled);
        }
        currentMaskFlags(t) {
            var e;
            return { ...t, _beforeTailState: (null == t || null == (e = t._beforeTailState) ? void 0 : e.masked) || (null == t ? void 0 : t._beforeTailState) };
        }
    }
    y.DEFAULT_DEFINITIONS = {
        0: /\d/,
        a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        "*": /./,
    };
    class S extends E {
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            const e = t.mask;
            e && (t.validate = (t) => t.search(e) >= 0), super._update(t);
        }
    }
    l.MaskedRegExp = S;
    class x extends E {
        constructor(t) {
            super({ ...x.DEFAULTS, ...t, definitions: Object.assign({}, y.DEFAULT_DEFINITIONS, null == t ? void 0 : t.definitions) });
        }
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            (t.definitions = Object.assign({}, this.definitions, t.definitions)), super._update(t), this._rebuildMask();
        }
        _rebuildMask() {
            const t = this.definitions;
            (this._blocks = []), (this.exposeBlock = void 0), (this._stops = []), (this._maskedBlocks = {});
            const e = this.mask;
            if (!e || !t) return;
            let s = !1,
                i = !1;
            for (let a = 0; a < e.length; ++a) {
                if (this.blocks) {
                    const t = e.slice(a),
                        s = Object.keys(this.blocks).filter((e) => 0 === t.indexOf(e));
                    s.sort((t, e) => e.length - t.length);
                    const i = s[0];
                    if (i) {
                        const { expose: t, repeat: e, ...s } = d(this.blocks[i]),
                            n = { lazy: this.lazy, eager: this.eager, placeholderChar: this.placeholderChar, displayChar: this.displayChar, overwrite: this.overwrite, ...s, repeat: e, parent: this },
                            r = null != e ? new l.RepeatBlock(n) : c(n);
                        r && (this._blocks.push(r), t && (this.exposeBlock = r), this._maskedBlocks[i] || (this._maskedBlocks[i] = []), this._maskedBlocks[i].push(this._blocks.length - 1)), (a += i.length - 1);
                        continue;
                    }
                }
                let n = e[a],
                    r = n in t;
                if (n === x.STOP_CHAR) {
                    this._stops.push(this._blocks.length);
                    continue;
                }
                if ("{" === n || "}" === n) {
                    s = !s;
                    continue;
                }
                if ("[" === n || "]" === n) {
                    i = !i;
                    continue;
                }
                if (n === x.ESCAPE_CHAR) {
                    if ((++a, (n = e[a]), !n)) break;
                    r = !1;
                }
                const u = r
                    ? new y({ isOptional: i, lazy: this.lazy, eager: this.eager, placeholderChar: this.placeholderChar, displayChar: this.displayChar, ...d(t[n]), parent: this })
                    : new F({ char: n, eager: this.eager, isUnmasking: s });
                this._blocks.push(u);
            }
        }
        get state() {
            return { ...super.state, _blocks: this._blocks.map((t) => t.state) };
        }
        set state(t) {
            if (!t) return void this.reset();
            const { _blocks: e, ...s } = t;
            this._blocks.forEach((t, s) => (t.state = e[s])), (super.state = s);
        }
        reset() {
            super.reset(), this._blocks.forEach((t) => t.reset());
        }
        get isComplete() {
            return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every((t) => t.isComplete);
        }
        get isFilled() {
            return this._blocks.every((t) => t.isFilled);
        }
        get isFixed() {
            return this._blocks.every((t) => t.isFixed);
        }
        get isOptional() {
            return this._blocks.every((t) => t.isOptional);
        }
        doCommit() {
            this._blocks.forEach((t) => t.doCommit()), super.doCommit();
        }
        get unmaskedValue() {
            return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce((t, e) => t + e.unmaskedValue, "");
        }
        set unmaskedValue(t) {
            if (this.exposeBlock) {
                const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
                (this.exposeBlock.unmaskedValue = t), this.appendTail(e), this.doCommit();
            } else super.unmaskedValue = t;
        }
        get value() {
            return this.exposeBlock ? this.exposeBlock.value : this._blocks.reduce((t, e) => t + e.value, "");
        }
        set value(t) {
            if (this.exposeBlock) {
                const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
                (this.exposeBlock.value = t), this.appendTail(e), this.doCommit();
            } else super.value = t;
        }
        get typedValue() {
            return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
        }
        set typedValue(t) {
            if (this.exposeBlock) {
                const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
                (this.exposeBlock.typedValue = t), this.appendTail(e), this.doCommit();
            } else super.typedValue = t;
        }
        get displayValue() {
            return this._blocks.reduce((t, e) => t + e.displayValue, "");
        }
        appendTail(t) {
            return super.appendTail(t).aggregate(this._appendPlaceholder());
        }
        _appendEager() {
            var t;
            const e = new v();
            let s = null == (t = this._mapPosToBlock(this.displayValue.length)) ? void 0 : t.index;
            if (null == s) return e;
            this._blocks[s].isFilled && ++s;
            for (let t = s; t < this._blocks.length; ++t) {
                const s = this._blocks[t]._appendEager();
                if (!s.inserted) break;
                e.aggregate(s);
            }
            return e;
        }
        _appendCharRaw(t, e) {
            void 0 === e && (e = {});
            const s = this._mapPosToBlock(this.displayValue.length),
                i = new v();
            if (!s) return i;
            for (let n, r = s.index; (n = this._blocks[r]); ++r) {
                var a;
                const s = n._appendChar(t, { ...e, _beforeTailState: null == (a = e._beforeTailState) || null == (a = a._blocks) ? void 0 : a[r] });
                if ((i.aggregate(s), s.consumed)) break;
            }
            return i;
        }
        extractTail(t, e) {
            void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length);
            const s = new A();
            return (
                t === e ||
                    this._forEachBlocksInRange(t, e, (t, e, i, a) => {
                        const n = t.extractTail(i, a);
                        (n.stop = this._findStopBefore(e)), (n.from = this._blockStartPos(e)), n instanceof A && (n.blockIndex = e), s.extend(n);
                    }),
                s
            );
        }
        extractInput(t, e, s) {
            if ((void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length), void 0 === s && (s = {}), t === e)) return "";
            let i = "";
            return (
                this._forEachBlocksInRange(t, e, (t, e, a, n) => {
                    i += t.extractInput(a, n, s);
                }),
                i
            );
        }
        _findStopBefore(t) {
            let e;
            for (let s = 0; s < this._stops.length; ++s) {
                const i = this._stops[s];
                if (!(i <= t)) break;
                e = i;
            }
            return e;
        }
        _appendPlaceholder(t) {
            const e = new v();
            if (this.lazy && null == t) return e;
            const s = this._mapPosToBlock(this.displayValue.length);
            if (!s) return e;
            const i = s.index,
                a = null != t ? t : this._blocks.length;
            return (
                this._blocks.slice(i, a).forEach((s) => {
                    var i;
                    (s.lazy && null == t) || e.aggregate(s._appendPlaceholder(null == (i = s._blocks) ? void 0 : i.length));
                }),
                e
            );
        }
        _mapPosToBlock(t) {
            let e = "";
            for (let s = 0; s < this._blocks.length; ++s) {
                const i = this._blocks[s],
                    a = e.length;
                if (((e += i.displayValue), t <= e.length)) return { index: s, offset: t - a };
            }
        }
        _blockStartPos(t) {
            return this._blocks.slice(0, t).reduce((t, e) => t + e.displayValue.length, 0);
        }
        _forEachBlocksInRange(t, e, s) {
            void 0 === e && (e = this.displayValue.length);
            const i = this._mapPosToBlock(t);
            if (i) {
                const t = this._mapPosToBlock(e),
                    a = t && i.index === t.index,
                    n = i.offset,
                    r = t && a ? t.offset : this._blocks[i.index].displayValue.length;
                if ((s(this._blocks[i.index], i.index, n, r), t && !a)) {
                    for (let e = i.index + 1; e < t.index; ++e) s(this._blocks[e], e, 0, this._blocks[e].displayValue.length);
                    s(this._blocks[t.index], t.index, 0, t.offset);
                }
            }
        }
        remove(t, e) {
            void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length);
            const s = super.remove(t, e);
            return (
                this._forEachBlocksInRange(t, e, (t, e, i, a) => {
                    s.aggregate(t.remove(i, a));
                }),
                s
            );
        }
        nearestInputPos(t, e) {
            if ((void 0 === e && (e = a.NONE), !this._blocks.length)) return 0;
            const s = new b(this, t);
            if (e === a.NONE) return s.pushRightBeforeInput() ? s.pos : (s.popState(), s.pushLeftBeforeInput() ? s.pos : this.displayValue.length);
            if (e === a.LEFT || e === a.FORCE_LEFT) {
                if (e === a.LEFT) {
                    if ((s.pushRightBeforeFilled(), s.ok && s.pos === t)) return t;
                    s.popState();
                }
                if ((s.pushLeftBeforeInput(), s.pushLeftBeforeRequired(), s.pushLeftBeforeFilled(), e === a.LEFT)) {
                    if ((s.pushRightBeforeInput(), s.pushRightBeforeRequired(), s.ok && s.pos <= t)) return s.pos;
                    if ((s.popState(), s.ok && s.pos <= t)) return s.pos;
                    s.popState();
                }
                return s.ok ? s.pos : e === a.FORCE_LEFT ? 0 : (s.popState(), s.ok ? s.pos : (s.popState(), s.ok ? s.pos : 0));
            }
            return e === a.RIGHT || e === a.FORCE_RIGHT
                ? (s.pushRightBeforeInput(),
                  s.pushRightBeforeRequired(),
                  s.pushRightBeforeFilled() ? s.pos : e === a.FORCE_RIGHT ? this.displayValue.length : (s.popState(), s.ok ? s.pos : (s.popState(), s.ok ? s.pos : this.nearestInputPos(t, a.LEFT))))
                : t;
        }
        totalInputPositions(t, e) {
            void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length);
            let s = 0;
            return (
                this._forEachBlocksInRange(t, e, (t, e, i, a) => {
                    s += t.totalInputPositions(i, a);
                }),
                s
            );
        }
        maskedBlock(t) {
            return this.maskedBlocks(t)[0];
        }
        maskedBlocks(t) {
            const e = this._maskedBlocks[t];
            return e ? e.map((t) => this._blocks[t]) : [];
        }
    }
    (x.DEFAULTS = { lazy: !0, placeholderChar: "_" }), (x.STOP_CHAR = "`"), (x.ESCAPE_CHAR = "\\"), (x.InputDefinition = y), (x.FixedDefinition = F), (l.MaskedPattern = x);
    class B extends x {
        get _matchFrom() {
            return this.maxLength - String(this.from).length;
        }
        constructor(t) {
            super(t);
        }
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            const { to: e = this.to || 0, from: s = this.from || 0, maxLength: i = this.maxLength || 0, autofix: a = this.autofix, ...n } = t;
            (this.to = e), (this.from = s), (this.maxLength = Math.max(String(e).length, i)), (this.autofix = a);
            const r = String(this.from).padStart(this.maxLength, "0"),
                u = String(this.to).padStart(this.maxLength, "0");
            let o = 0;
            for (; o < u.length && u[o] === r[o]; ) ++o;
            (n.mask = u.slice(0, o).replace(/0/g, "\\0") + "0".repeat(this.maxLength - o)), super._update(n);
        }
        get isComplete() {
            return super.isComplete && Boolean(this.value);
        }
        boundaries(t) {
            let e = "",
                s = "";
            const [, i, a] = t.match(/^(\D*)(\d*)(\D*)/) || [];
            return a && ((e = "0".repeat(i.length) + a), (s = "9".repeat(i.length) + a)), (e = e.padEnd(this.maxLength, "0")), (s = s.padEnd(this.maxLength, "9")), [e, s];
        }
        doPrepareChar(t, e) {
            let s;
            if ((void 0 === e && (e = {}), ([t, s] = super.doPrepareChar(t.replace(/\D/g, ""), e)), !this.autofix || !t)) return (s.skip = !this.isComplete), [t, s];
            const i = String(this.from).padStart(this.maxLength, "0"),
                a = String(this.to).padStart(this.maxLength, "0"),
                n = this.value + t;
            if (n.length > this.maxLength) return ["", s];
            const [r, u] = this.boundaries(n);
            return Number(u) < this.from ? [i[n.length - 1], s] : Number(r) > this.to ? ("pad" === this.autofix && n.length < this.maxLength ? ["", s.aggregate(this.append(i[n.length - 1] + t, e))] : [a[n.length - 1], s]) : [t, s];
        }
        doValidate(t) {
            const e = this.value;
            if (-1 === e.search(/[^0]/) && e.length <= this._matchFrom) return !0;
            const [s, i] = this.boundaries(e);
            return this.from <= Number(i) && Number(s) <= this.to && super.doValidate(t);
        }
    }
    l.MaskedRange = B;
    class w extends x {
        static extractPatternOptions(t) {
            const { mask: s, pattern: i, ...a } = t;
            return { ...a, mask: e(s) ? s : i };
        }
        constructor(t) {
            super(w.extractPatternOptions({ ...w.DEFAULTS, ...t }));
        }
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            const { mask: s, pattern: i, blocks: a, ...n } = { ...w.DEFAULTS, ...t },
                r = Object.assign({}, w.GET_DEFAULT_BLOCKS());
            t.min && (r.Y.from = t.min.getFullYear()),
                t.max && (r.Y.to = t.max.getFullYear()),
                t.min && t.max && r.Y.from === r.Y.to && ((r.m.from = t.min.getMonth() + 1), (r.m.to = t.max.getMonth() + 1), r.m.from === r.m.to && ((r.d.from = t.min.getDate()), (r.d.to = t.max.getDate()))),
                Object.assign(r, this.blocks, a),
                Object.keys(r).forEach((e) => {
                    const s = r[e];
                    !("autofix" in s) && "autofix" in t && (s.autofix = t.autofix);
                }),
                super._update({ ...n, mask: e(s) ? s : i, blocks: r });
        }
        doValidate(t) {
            const e = this.date;
            return super.doValidate(t) && (!this.isComplete || (this.isDateExist(this.value) && null != e && (null == this.min || this.min <= e) && (null == this.max || e <= this.max)));
        }
        isDateExist(t) {
            return this.format(this.parse(t, this), this).indexOf(t) >= 0;
        }
        get date() {
            return this.typedValue;
        }
        set date(t) {
            this.typedValue = t;
        }
        get typedValue() {
            return this.isComplete ? super.typedValue : null;
        }
        set typedValue(t) {
            super.typedValue = t;
        }
        maskEquals(t) {
            return t === Date || super.maskEquals(t);
        }
        optionsIsChanged(t) {
            return super.optionsIsChanged(w.extractPatternOptions(t));
        }
    }
    (w.GET_DEFAULT_BLOCKS = () => ({ d: { mask: B, from: 1, to: 31, maxLength: 2 }, m: { mask: B, from: 1, to: 12, maxLength: 2 }, Y: { mask: B, from: 1900, to: 9999 } })),
        (w.DEFAULTS = {
            mask: Date,
            pattern: "d{.}`m{.}`Y",
            format: (t, e) => (t ? [String(t.getDate()).padStart(2, "0"), String(t.getMonth() + 1).padStart(2, "0"), t.getFullYear()].join(".") : ""),
            parse: (t, e) => {
                const [s, i, a] = t.split(".").map(Number);
                return new Date(a, i - 1, s);
            },
        }),
        (l.MaskedDate = w);
    class T extends E {
        constructor(t) {
            super({ ...T.DEFAULTS, ...t }), (this.currentMask = void 0);
        }
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            super._update(t),
                "mask" in t &&
                    ((this.exposeMask = void 0),
                    (this.compiledMasks = Array.isArray(t.mask)
                        ? t.mask.map((t) => {
                              const { expose: e, ...s } = d(t),
                                  i = c({ overwrite: this._overwrite, eager: this._eager, skipInvalid: this._skipInvalid, ...s });
                              return e && (this.exposeMask = i), i;
                          })
                        : []));
        }
        _appendCharRaw(t, e) {
            void 0 === e && (e = {});
            const s = this._applyDispatch(t, e);
            return this.currentMask && s.aggregate(this.currentMask._appendChar(t, this.currentMaskFlags(e))), s;
        }
        _applyDispatch(t, e, s) {
            void 0 === t && (t = ""), void 0 === e && (e = {}), void 0 === s && (s = "");
            const i = e.tail && null != e._beforeTailState ? e._beforeTailState._value : this.value,
                a = this.rawInputValue,
                n = e.tail && null != e._beforeTailState ? e._beforeTailState._rawInputValue : a,
                r = a.slice(n.length),
                u = this.currentMask,
                o = new v(),
                l = null == u ? void 0 : u.state;
            return (
                (this.currentMask = this.doDispatch(t, { ...e }, s)),
                this.currentMask &&
                    (this.currentMask !== u
                        ? (this.currentMask.reset(),
                          n && (this.currentMask.append(n, { raw: !0 }), (o.tailShift = this.currentMask.value.length - i.length)),
                          r && (o.tailShift += this.currentMask.append(r, { raw: !0, tail: !0 }).tailShift))
                        : l && (this.currentMask.state = l)),
                o
            );
        }
        _appendPlaceholder() {
            const t = this._applyDispatch();
            return this.currentMask && t.aggregate(this.currentMask._appendPlaceholder()), t;
        }
        _appendEager() {
            const t = this._applyDispatch();
            return this.currentMask && t.aggregate(this.currentMask._appendEager()), t;
        }
        appendTail(t) {
            const e = new v();
            return t && e.aggregate(this._applyDispatch("", {}, t)), e.aggregate(this.currentMask ? this.currentMask.appendTail(t) : super.appendTail(t));
        }
        currentMaskFlags(t) {
            var e, s;
            return { ...t, _beforeTailState: ((null == (e = t._beforeTailState) ? void 0 : e.currentMaskRef) === this.currentMask && (null == (s = t._beforeTailState) ? void 0 : s.currentMask)) || t._beforeTailState };
        }
        doDispatch(t, e, s) {
            return void 0 === e && (e = {}), void 0 === s && (s = ""), this.dispatch(t, this, e, s);
        }
        doValidate(t) {
            return super.doValidate(t) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(t)));
        }
        doPrepare(t, e) {
            void 0 === e && (e = {});
            let [s, i] = super.doPrepare(t, e);
            if (this.currentMask) {
                let t;
                ([s, t] = super.doPrepare(s, this.currentMaskFlags(e))), (i = i.aggregate(t));
            }
            return [s, i];
        }
        doPrepareChar(t, e) {
            void 0 === e && (e = {});
            let [s, i] = super.doPrepareChar(t, e);
            if (this.currentMask) {
                let t;
                ([s, t] = super.doPrepareChar(s, this.currentMaskFlags(e))), (i = i.aggregate(t));
            }
            return [s, i];
        }
        reset() {
            var t;
            null == (t = this.currentMask) || t.reset(), this.compiledMasks.forEach((t) => t.reset());
        }
        get value() {
            return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : "";
        }
        set value(t) {
            this.exposeMask ? ((this.exposeMask.value = t), (this.currentMask = this.exposeMask), this._applyDispatch()) : (super.value = t);
        }
        get unmaskedValue() {
            return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : "";
        }
        set unmaskedValue(t) {
            this.exposeMask ? ((this.exposeMask.unmaskedValue = t), (this.currentMask = this.exposeMask), this._applyDispatch()) : (super.unmaskedValue = t);
        }
        get typedValue() {
            return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : "";
        }
        set typedValue(t) {
            if (this.exposeMask) return (this.exposeMask.typedValue = t), (this.currentMask = this.exposeMask), void this._applyDispatch();
            let e = String(t);
            this.currentMask && ((this.currentMask.typedValue = t), (e = this.currentMask.unmaskedValue)), (this.unmaskedValue = e);
        }
        get displayValue() {
            return this.currentMask ? this.currentMask.displayValue : "";
        }
        get isComplete() {
            var t;
            return Boolean(null == (t = this.currentMask) ? void 0 : t.isComplete);
        }
        get isFilled() {
            var t;
            return Boolean(null == (t = this.currentMask) ? void 0 : t.isFilled);
        }
        remove(t, e) {
            const s = new v();
            return this.currentMask && s.aggregate(this.currentMask.remove(t, e)).aggregate(this._applyDispatch()), s;
        }
        get state() {
            var t;
            return { ...super.state, _rawInputValue: this.rawInputValue, compiledMasks: this.compiledMasks.map((t) => t.state), currentMaskRef: this.currentMask, currentMask: null == (t = this.currentMask) ? void 0 : t.state };
        }
        set state(t) {
            const { compiledMasks: e, currentMaskRef: s, currentMask: i, ...a } = t;
            e && this.compiledMasks.forEach((t, s) => (t.state = e[s])), null != s && ((this.currentMask = s), (this.currentMask.state = i)), (super.state = a);
        }
        extractInput(t, e, s) {
            return this.currentMask ? this.currentMask.extractInput(t, e, s) : "";
        }
        extractTail(t, e) {
            return this.currentMask ? this.currentMask.extractTail(t, e) : super.extractTail(t, e);
        }
        doCommit() {
            this.currentMask && this.currentMask.doCommit(), super.doCommit();
        }
        nearestInputPos(t, e) {
            return this.currentMask ? this.currentMask.nearestInputPos(t, e) : super.nearestInputPos(t, e);
        }
        get overwrite() {
            return this.currentMask ? this.currentMask.overwrite : this._overwrite;
        }
        set overwrite(t) {
            this._overwrite = t;
        }
        get eager() {
            return this.currentMask ? this.currentMask.eager : this._eager;
        }
        set eager(t) {
            this._eager = t;
        }
        get skipInvalid() {
            return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
        }
        set skipInvalid(t) {
            this._skipInvalid = t;
        }
        maskEquals(t) {
            return Array.isArray(t)
                ? this.compiledMasks.every((e, s) => {
                      if (!t[s]) return;
                      const { mask: i, ...a } = t[s];
                      return u(e, a) && e.maskEquals(i);
                  })
                : super.maskEquals(t);
        }
        typedValueEquals(t) {
            var e;
            return Boolean(null == (e = this.currentMask) ? void 0 : e.typedValueEquals(t));
        }
    }
    (T.DEFAULTS = void 0),
        (T.DEFAULTS = {
            dispatch: (t, e, s, i) => {
                if (!e.compiledMasks.length) return;
                const n = e.rawInputValue,
                    r = e.compiledMasks.map((r, u) => {
                        const o = e.currentMask === r,
                            l = o ? r.displayValue.length : r.nearestInputPos(r.displayValue.length, a.FORCE_LEFT);
                        return (
                            r.rawInputValue !== n ? (r.reset(), r.append(n, { raw: !0 })) : o || r.remove(l),
                            r.append(t, e.currentMaskFlags(s)),
                            r.appendTail(i),
                            { index: u, weight: r.rawInputValue.length, totalInputPositions: r.totalInputPositions(0, Math.max(l, r.nearestInputPos(r.displayValue.length, a.FORCE_LEFT))) }
                        );
                    });
                return r.sort((t, e) => e.weight - t.weight || e.totalInputPositions - t.totalInputPositions), e.compiledMasks[r[0].index];
            },
        }),
        (l.MaskedDynamic = T);
    class D extends x {
        constructor(t) {
            super(t);
        }
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            const { enum: e, ...s } = t;
            if (e) {
                const t = e.map((t) => t.length),
                    i = Math.min(...t),
                    a = Math.max(...t) - i;
                (s.mask = "*".repeat(i)), a && (s.mask += "[" + "*".repeat(a) + "]"), (this.enum = e);
            }
            super._update(s);
        }
        doValidate(t) {
            return this.enum.some((t) => 0 === t.indexOf(this.unmaskedValue)) && super.doValidate(t);
        }
    }
    l.MaskedEnum = D;
    class I extends E {
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            super._update({ ...t, validate: t.mask });
        }
    }
    var M;
    l.MaskedFunction = I;
    class V extends E {
        constructor(t) {
            super({ ...V.DEFAULTS, ...t });
        }
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            super._update(t), this._updateRegExps();
        }
        _updateRegExps() {
            const t = "^" + (this.allowNegative ? "[+|\\-]?" : ""),
                e = (this.scale ? "(" + r(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
            (this._numberRegExp = new RegExp(t + "\\d*" + e)), (this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(r).join("") + "]", "g")), (this._thousandsSeparatorRegExp = new RegExp(r(this.thousandsSeparator), "g"));
        }
        _removeThousandsSeparators(t) {
            return t.replace(this._thousandsSeparatorRegExp, "");
        }
        _insertThousandsSeparators(t) {
            const e = t.split(this.radix);
            return (e[0] = e[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator)), e.join(this.radix);
        }
        doPrepareChar(t, e) {
            void 0 === e && (e = {});
            const [s, i] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && ((e.input && e.raw) || (!e.input && !e.raw)) ? t.replace(this._mapToRadixRegExp, this.radix) : t), e);
            return t && !s && (i.skip = !0), !s || this.allowPositive || this.value || "-" === s || i.aggregate(this._appendChar("-")), [s, i];
        }
        _separatorsCount(t, e) {
            void 0 === e && (e = !1);
            let s = 0;
            for (let i = 0; i < t; ++i) this._value.indexOf(this.thousandsSeparator, i) === i && (++s, e && (t += this.thousandsSeparator.length));
            return s;
        }
        _separatorsCountFromSlice(t) {
            return void 0 === t && (t = this._value), this._separatorsCount(this._removeThousandsSeparators(t).length, !0);
        }
        extractInput(t, e, s) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length), ([t, e] = this._adjustRangeWithSeparators(t, e)), this._removeThousandsSeparators(super.extractInput(t, e, s));
        }
        _appendCharRaw(t, e) {
            void 0 === e && (e = {});
            const s = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value,
                i = this._separatorsCountFromSlice(s);
            this._value = this._removeThousandsSeparators(this.value);
            const a = this._value;
            this._value += t;
            const n = this.number;
            let r,
                u = !isNaN(n),
                o = !1;
            if (u) {
                let t;
                null != this.min && this.min < 0 && this.number < this.min && (t = this.min),
                    null != this.max && this.max > 0 && this.number > this.max && (t = this.max),
                    null != t && (this.autofix ? ((this._value = this.format(t, this).replace(V.UNMASKED_RADIX, this.radix)), o || (o = a === this._value && !e.tail)) : (u = !1)),
                    u && (u = Boolean(this._value.match(this._numberRegExp)));
            }
            u ? (r = new v({ inserted: this._value.slice(a.length), rawInserted: o ? "" : t, skip: o })) : ((this._value = a), (r = new v())), (this._value = this._insertThousandsSeparators(this._value));
            const l = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value,
                h = this._separatorsCountFromSlice(l);
            return (r.tailShift += (h - i) * this.thousandsSeparator.length), r;
        }
        _findSeparatorAround(t) {
            if (this.thousandsSeparator) {
                const e = t - this.thousandsSeparator.length + 1,
                    s = this.value.indexOf(this.thousandsSeparator, e);
                if (s <= t) return s;
            }
            return -1;
        }
        _adjustRangeWithSeparators(t, e) {
            const s = this._findSeparatorAround(t);
            s >= 0 && (t = s);
            const i = this._findSeparatorAround(e);
            return i >= 0 && (e = i + this.thousandsSeparator.length), [t, e];
        }
        remove(t, e) {
            void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length), ([t, e] = this._adjustRangeWithSeparators(t, e));
            const s = this.value.slice(0, t),
                i = this.value.slice(e),
                a = this._separatorsCount(s.length);
            this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(s + i));
            const n = this._separatorsCountFromSlice(s);
            return new v({ tailShift: (n - a) * this.thousandsSeparator.length });
        }
        nearestInputPos(t, e) {
            if (!this.thousandsSeparator) return t;
            switch (e) {
                case a.NONE:
                case a.LEFT:
                case a.FORCE_LEFT: {
                    const s = this._findSeparatorAround(t - 1);
                    if (s >= 0) {
                        const i = s + this.thousandsSeparator.length;
                        if (t < i || this.value.length <= i || e === a.FORCE_LEFT) return s;
                    }
                    break;
                }
                case a.RIGHT:
                case a.FORCE_RIGHT: {
                    const e = this._findSeparatorAround(t);
                    if (e >= 0) return e + this.thousandsSeparator.length;
                }
            }
            return t;
        }
        doCommit() {
            if (this.value) {
                const t = this.number;
                let e = t;
                null != this.min && (e = Math.max(e, this.min)), null != this.max && (e = Math.min(e, this.max)), e !== t && (this.unmaskedValue = this.format(e, this));
                let s = this.value;
                this.normalizeZeros && (s = this._normalizeZeros(s)), this.padFractionalZeros && this.scale > 0 && (s = this._padFractionalZeros(s)), (this._value = s);
            }
            super.doCommit();
        }
        _normalizeZeros(t) {
            const e = this._removeThousandsSeparators(t).split(this.radix);
            return (
                (e[0] = e[0].replace(/^(\D*)(0*)(\d*)/, (t, e, s, i) => e + i)),
                t.length && !/\d$/.test(e[0]) && (e[0] = e[0] + "0"),
                e.length > 1 && ((e[1] = e[1].replace(/0*$/, "")), e[1].length || (e.length = 1)),
                this._insertThousandsSeparators(e.join(this.radix))
            );
        }
        _padFractionalZeros(t) {
            if (!t) return t;
            const e = t.split(this.radix);
            return e.length < 2 && e.push(""), (e[1] = e[1].padEnd(this.scale, "0")), e.join(this.radix);
        }
        doSkipInvalid(t, e, s) {
            void 0 === e && (e = {});
            const i = 0 === this.scale && t !== this.thousandsSeparator && (t === this.radix || t === V.UNMASKED_RADIX || this.mapToRadix.includes(t));
            return super.doSkipInvalid(t, e, s) && !i;
        }
        get unmaskedValue() {
            return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, V.UNMASKED_RADIX);
        }
        set unmaskedValue(t) {
            super.unmaskedValue = t;
        }
        get typedValue() {
            return this.parse(this.unmaskedValue, this);
        }
        set typedValue(t) {
            this.rawInputValue = this.format(t, this).replace(V.UNMASKED_RADIX, this.radix);
        }
        get number() {
            return this.typedValue;
        }
        set number(t) {
            this.typedValue = t;
        }
        get allowNegative() {
            return (null != this.min && this.min < 0) || (null != this.max && this.max < 0);
        }
        get allowPositive() {
            return (null != this.min && this.min > 0) || (null != this.max && this.max > 0);
        }
        typedValueEquals(t) {
            return (super.typedValueEquals(t) || (V.EMPTY_VALUES.includes(t) && V.EMPTY_VALUES.includes(this.typedValue))) && !(0 === t && "" === this.value);
        }
    }
    (M = V),
        (V.UNMASKED_RADIX = "."),
        (V.EMPTY_VALUES = [...E.EMPTY_VALUES, 0]),
        (V.DEFAULTS = {
            mask: Number,
            radix: ",",
            thousandsSeparator: "",
            mapToRadix: [M.UNMASKED_RADIX],
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER,
            scale: 2,
            normalizeZeros: !0,
            padFractionalZeros: !1,
            parse: Number,
            format: (t) => t.toLocaleString("en-US", { useGrouping: !1, maximumFractionDigits: 20 }),
        }),
        (l.MaskedNumber = V);
    const P = { MASKED: "value", UNMASKED: "unmaskedValue", TYPED: "typedValue" };
    function O(t, e, s) {
        void 0 === e && (e = P.MASKED), void 0 === s && (s = P.MASKED);
        const i = c(t);
        return (t) => i.runIsolated((i) => ((i[e] = t), i[s]));
    }
    function R(t, e, s, i) {
        return O(e, s, i)(t);
    }
    (l.PIPE_TYPE = P), (l.createPipe = O), (l.pipe = R);
    class L extends x {
        get repeatFrom() {
            var t;
            return null != (t = Array.isArray(this.repeat) ? this.repeat[0] : this.repeat === 1 / 0 ? 0 : this.repeat) ? t : 0;
        }
        get repeatTo() {
            var t;
            return null != (t = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) ? t : 1 / 0;
        }
        constructor(t) {
            super(t);
        }
        updateOptions(t) {
            super.updateOptions(t);
        }
        _update(t) {
            var e, s, i;
            const { repeat: a, ...n } = d(t);
            this._blockOpts = Object.assign({}, this._blockOpts, n);
            const r = c(this._blockOpts);
            (this.repeat = null != (e = null != (s = null != a ? a : r.repeat) ? s : this.repeat) ? e : 1 / 0),
                super._update({
                    mask: "m".repeat(Math.max((this.repeatTo === 1 / 0 && (null == (i = this._blocks) ? void 0 : i.length)) || 0, this.repeatFrom)),
                    blocks: { m: r },
                    eager: r.eager,
                    overwrite: r.overwrite,
                    skipInvalid: r.skipInvalid,
                    lazy: r.lazy,
                    placeholderChar: r.placeholderChar,
                    displayChar: r.displayChar,
                });
        }
        _allocateBlock(t) {
            return t < this._blocks.length ? this._blocks[t] : this.repeatTo === 1 / 0 || this._blocks.length < this.repeatTo ? (this._blocks.push(c(this._blockOpts)), (this.mask += "m"), this._blocks[this._blocks.length - 1]) : void 0;
        }
        _appendCharRaw(t, e) {
            void 0 === e && (e = {});
            const s = new v();
            for (
                let u, o, l = null != (i = null == (a = this._mapPosToBlock(this.displayValue.length)) ? void 0 : a.index) ? i : Math.max(this._blocks.length - 1, 0);
                (u = null != (n = this._blocks[l]) ? n : (o = !o && this._allocateBlock(l)));
                ++l
            ) {
                var i, a, n, r;
                const h = u._appendChar(t, { ...e, _beforeTailState: null == (r = e._beforeTailState) || null == (r = r._blocks) ? void 0 : r[l] });
                if (h.skip && o) {
                    this._blocks.pop(), (this.mask = this.mask.slice(1));
                    break;
                }
                if ((s.aggregate(h), h.consumed)) break;
            }
            return s;
        }
        _trimEmptyTail(t, e) {
            var s, i;
            void 0 === t && (t = 0);
            const a = Math.max((null == (s = this._mapPosToBlock(t)) ? void 0 : s.index) || 0, this.repeatFrom, 0);
            let n;
            null != e && (n = null == (i = this._mapPosToBlock(e)) ? void 0 : i.index), null == n && (n = this._blocks.length - 1);
            let r = 0;
            for (let t = n; a <= t && !this._blocks[t].unmaskedValue; --t, ++r);
            r && (this._blocks.splice(n - r + 1, r), (this.mask = this.mask.slice(r)));
        }
        reset() {
            super.reset(), this._trimEmptyTail();
        }
        remove(t, e) {
            void 0 === t && (t = 0), void 0 === e && (e = this.displayValue.length);
            const s = super.remove(t, e);
            return this._trimEmptyTail(t, e), s;
        }
        totalInputPositions(t, e) {
            return void 0 === t && (t = 0), null == e && this.repeatTo === 1 / 0 ? 1 / 0 : super.totalInputPositions(t, e);
        }
        get state() {
            return super.state;
        }
        set state(t) {
            (this._blocks.length = t._blocks.length), (this.mask = this.mask.slice(0, this._blocks.length)), (super.state = t);
        }
    }
    l.RepeatBlock = L;
    try {
        globalThis.IMask = l;
    } catch {}
    (t.ChangeDetails = v),
        (t.ChunksTailDetails = A),
        (t.DIRECTION = a),
        (t.HTMLContenteditableMaskElement = k),
        (t.HTMLInputMaskElement = m),
        (t.HTMLMaskElement = g),
        (t.InputMask = _),
        (t.MaskElement = p),
        (t.Masked = E),
        (t.MaskedDate = w),
        (t.MaskedDynamic = T),
        (t.MaskedEnum = D),
        (t.MaskedFunction = I),
        (t.MaskedNumber = V),
        (t.MaskedPattern = x),
        (t.MaskedRange = B),
        (t.MaskedRegExp = S),
        (t.PIPE_TYPE = P),
        (t.PatternFixedDefinition = F),
        (t.PatternInputDefinition = y),
        (t.RepeatBlock = L),
        (t.createMask = c),
        (t.createPipe = O),
        (t.default = l),
        (t.forceDirection = n),
        (t.normalizeOpts = d),
        (t.pipe = R),
        Object.defineProperty(t, "__esModule", { value: !0 });
}),
    (function (t) {
        var e;
        if (("function" == typeof define && define.amd && (define(t), (e = !0)), "object" == typeof exports && ((module.exports = t()), (e = !0)), !e)) {
            var s = window.Cookies,
                i = (window.Cookies = t());
            i.noConflict = function () {
                return (window.Cookies = s), i;
            };
        }
    })(function () {
        function t() {
            for (var t = 0, e = {}; t < arguments.length; t++) {
                var s = arguments[t];
                for (var i in s) e[i] = s[i];
            }
            return e;
        }
        function e(t) {
            return t.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
        }
        return (function s(i) {
            function a() {}
            function n(e, s, n) {
                if ("undefined" != typeof document) {
                    "number" == typeof (n = t({ path: "/" }, a.defaults, n)).expires && (n.expires = new Date(1 * new Date() + 864e5 * n.expires)), (n.expires = n.expires ? n.expires.toUTCString() : "");
                    try {
                        var r = JSON.stringify(s);
                        /^[\{\[]/.test(r) && (s = r);
                    } catch (t) {}
                    (s = i.write ? i.write(s, e) : encodeURIComponent(String(s)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)),
                        (e = encodeURIComponent(String(e))
                            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                            .replace(/[\(\)]/g, escape));
                    var u = "";
                    for (var o in n) n[o] && ((u += "; " + o), !0 !== n[o] && (u += "=" + n[o].split(";")[0]));
                    return (document.cookie = e + "=" + s + u);
                }
            }
            function r(t, s) {
                if ("undefined" != typeof document) {
                    for (var a = {}, n = document.cookie ? document.cookie.split("; ") : [], r = 0; r < n.length; r++) {
                        var u = n[r].split("="),
                            o = u.slice(1).join("=");
                        s || '"' !== o.charAt(0) || (o = o.slice(1, -1));
                        try {
                            var l = e(u[0]);
                            if (((o = (i.read || i)(o, l) || e(o)), s))
                                try {
                                    o = JSON.parse(o);
                                } catch (t) {}
                            if (((a[l] = o), t === l)) break;
                        } catch (t) {}
                    }
                    return t ? a[t] : a;
                }
            }
            return (
                (a.set = n),
                (a.get = function (t) {
                    return r(t, !1);
                }),
                (a.getJSON = function (t) {
                    return r(t, !0);
                }),
                (a.remove = function (e, s) {
                    n(e, "", t(s, { expires: -1 }));
                }),
                (a.defaults = {}),
                (a.withConverter = s),
                a
            );
        })(function () {});
    }),
    (function (t) {
        var e;
        if (("function" == typeof define && define.amd && (define(t), (e = !0)), "object" == typeof exports && ((module.exports = t()), (e = !0)), !e)) {
            var s = window.Cookies,
                i = (window.Cookies = t());
            i.noConflict = function () {
                return (window.Cookies = s), i;
            };
        }
    })(function () {
        function t() {
            for (var t = 0, e = {}; t < arguments.length; t++) {
                var s = arguments[t];
                for (var i in s) e[i] = s[i];
            }
            return e;
        }
        function e(t) {
            return t.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
        }
        return (function s(i) {
            function a() {}
            function n(e, s, n) {
                if ("undefined" != typeof document) {
                    "number" == typeof (n = t({ path: "/" }, a.defaults, n)).expires && (n.expires = new Date(1 * new Date() + 864e5 * n.expires)), (n.expires = n.expires ? n.expires.toUTCString() : "");
                    try {
                        var r = JSON.stringify(s);
                        /^[\{\[]/.test(r) && (s = r);
                    } catch (t) {}
                    (s = i.write ? i.write(s, e) : encodeURIComponent(String(s)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)),
                        (e = encodeURIComponent(String(e))
                            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                            .replace(/[\(\)]/g, escape));
                    var u = "";
                    for (var o in n) n[o] && ((u += "; " + o), !0 !== n[o] && (u += "=" + n[o].split(";")[0]));
                    return (document.cookie = e + "=" + s + u);
                }
            }
            function r(t, s) {
                if ("undefined" != typeof document) {
                    for (var a = {}, n = document.cookie ? document.cookie.split("; ") : [], r = 0; r < n.length; r++) {
                        var u = n[r].split("="),
                            o = u.slice(1).join("=");
                        s || '"' !== o.charAt(0) || (o = o.slice(1, -1));
                        try {
                            var l = e(u[0]);
                            if (((o = (i.read || i)(o, l) || e(o)), s))
                                try {
                                    o = JSON.parse(o);
                                } catch (t) {}
                            if (((a[l] = o), t === l)) break;
                        } catch (t) {}
                    }
                    return t ? a[t] : a;
                }
            }
            return (
                (a.set = n),
                (a.get = function (t) {
                    return r(t, !1);
                }),
                (a.getJSON = function (t) {
                    return r(t, !0);
                }),
                (a.remove = function (e, s) {
                    n(e, "", t(s, { expires: -1 }));
                }),
                (a.defaults = {}),
                (a.withConverter = s),
                a
            );
        })(function () {});
    });
