// toogle about item
function toggleDetail(e) {
    const target =  $(e.target)

    if($(target).hasClass("active")) {
        $(target).html("More Info").removeClass("active")
    } else {
        $(target).html("Less Info").addClass("active")
    }

    const item = $(target).parents(".about-item")
    const detail = $(item).children(".about-item-detail")

    $(detail).slideToggle()
}

// on form submit and validation
function onFormSubmit(e) {
    e.preventDefault()
    const email = $("#inputEmail")
    const subject = $("#inputSubject")
    const message = $("#inputMessage")

    if(!$(email).val()) {
        alert("Email is required")
    } else if(!$(subject).val()) {
        alert("Subject is required")
    } else if(!$(message).val()) {
        alert("Message is required")
    } else {
        alert("Form Submitted")
        $(email).val("")
        $(subject).val("")
        $(message).val("")
    }
}

// typing text
function startTyping(target, texts, typeSpeed = 120, pause = 1200) {
    const $el = $(target)
    let textIndex = 0
    let charIndex = 0
    let isDeleting = false

    const tick = () => {
        const currentText = texts[textIndex]
        const fullText = isDeleting
            ? currentText.substring(0, charIndex - 1)
            : currentText.substring(0, charIndex + 1)

        $el.text(fullText)

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true
            setTimeout(tick, pause)
            return
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false
            textIndex = (textIndex + 1) % texts.length
            setTimeout(tick, 200)
            return
        }

        charIndex += isDeleting ? -1 : 1
        setTimeout(tick, isDeleting ? typeSpeed / 2 : typeSpeed)
    }

    tick()
}

// click + scroll remains consistent (scroll event adjusts to active state)
function throttle(fn, wait) {
    let last = 0
    return function (...args) {
        const now = Date.now()
        if (now - last >= wait) {
            last = now
            fn.apply(this, args)
        }
    }
}

function setupNavActiveOnScroll() {
    const $navLinks = $('.navbar-nav .nav-link')
    const sections = $navLinks
        .map((_, link) => $(link).attr('href'))
        .get()
        .filter(href => href && href.startsWith('#'))

    const setActive = (hash) => {
        $navLinks.removeClass('active')
        $navLinks.filter(`[href="${hash}"]`).addClass('active')
    }

    $navLinks.on('click', function (e) {
        e.preventDefault()
        const hash = $(this).attr('href')
        const $target = $(hash)

        if ($target.length) {
            const offset = $target.offset().top - 70
            $('html, body').animate({ scrollTop: offset }, 100)
        }

        setActive(hash)
    })

    const onScroll = () => {
        const scrollPos = $(window).scrollTop() + 120
        let current = sections[0]

        sections.forEach((hash) => {
            const $section = $(hash)
            if ($section.length && $section.offset().top <= scrollPos) {
                current = hash
            }
        })

        setActive(current)
    }

    $(window).on('scroll', throttle(onScroll, 100))
    onScroll()
}

// toogle light + dark themes
function applyTheme(isDark) {
    const $body = $('body')
    if (isDark) {
        $body.addClass('dark-mode')
        $('#theme-toggle').text('☀️')
    } else {
        $body.removeClass('dark-mode')
        $('#theme-toggle').text('🌙')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

function setupThemeToggle() {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark

    applyTheme(isDark)

    $('#theme-toggle').on('click', () => {
        applyTheme(!$('body').hasClass('dark-mode'))
    })
}

$(document).ready(() => {
    startTyping('#typing-title', ['Gani Fam', 'Programmer'])
    setupNavActiveOnScroll()
    setupThemeToggle()
})