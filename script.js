/**
 * ============================================================
 *  Official HIGE DANdism Fan Page — script.js
 *  ULTRA LUXURY EDITION 2026
 *  구조: 상태관리 → DOM캐시 → 데이터 → 파티클 → 커서
 *        → 유튜브 → 오디오 → 트랙재생 → 렌더링 → 라우팅 → 이벤트 → 초기화
 * ============================================================
 */

'use strict';


/* ============================================================
   1. 전역 상태 (State)
   ============================================================ */
const state = {
    currentSection: 'home',
    currentPage: 1,
    currentVolume: 100,
    isMuted: true,
    currentMode: 'youtube',
    cursor: { mx: 0, my: 0, rx: 0, ry: 0 },
    ytPlayer: null,
    rafId: null,
};


/* ============================================================
   2. DOM 캐시 (DOM Cache)
   ============================================================ */
const dom = {
    cursor:        document.getElementById('cursor'),
    cursorRing:    document.getElementById('cursorRing'),
    homeTitle:     document.getElementById('homeTitle'),
    albumGrid:     document.getElementById('albumGrid'),
    albumDetail:   document.getElementById('albumDetail'),
    detailThumb:   document.getElementById('detailThumb'),
    detailName:    document.getElementById('detailName'),
    detailInfo:    document.getElementById('detailInfo'),
    trackList:     document.getElementById('trackList'),
    singleList:    document.getElementById('singleTrackList'),
    concertList:   document.getElementById('concertList'),
    pagination:    document.getElementById('pagination'),
    musicBtn:      document.getElementById('musicBtn'),
    volumeSlider:  document.getElementById('volumeSlider'),
    scrollHint:    document.getElementById('scrollHint'),
    localPlayer:   document.getElementById('localPlayer'),
    youtubeLayer:  document.getElementById('youtubeLayer'),
    localLayer:    document.getElementById('localLayer'),
    navLinks:      document.querySelectorAll('[data-section]'),
    sections:      document.querySelectorAll('.section'),
    detailBackBtn: document.getElementById('detailBackBtn'),
    loader:        document.getElementById('loader'),
    particleCanvas: document.getElementById('particleCanvas'),
};


/* ============================================================
   3. 데이터 (Data)
   ============================================================ */

const ALBUMS = [
    {
        id: 'rejoice',
        thumb: 'REJOICE.jpg',
        name: 'Rejoice',
        year: '2024',
        type: '3rd Regular Album',
        tracks: [
            { title: 'Finder',     videoSrc: 'videos/finder.mp4' },
            { title: 'Mixed Nuts', videoId: 'U_rWZK_8vUY' },
            { title: 'Subtitle',   videoId: 'VS4vWRqPuoc' },
            { title: 'SOULSOUP',   videoId: 'jECUecgIKe4' },
        ],
    },
    {
        id: 'editorial',
        thumb: 'EDITORIAL.jpg',
        name: 'Editorial',
        year: '2021',
        type: '2nd Regular Album',
        tracks: [
            { title: 'I LOVE...', videoId: 'bt8wNQVaVsE' },
            { title: 'Laughter',  videoId: 'kff_XDXXyZY' },
            { title: 'Cry Baby',  videoId: 'O1bhZgkC4Gw' },
        ],
    },
    {
        id: 'traveler',
        thumb: 'TRAVELER.jpg',
        name: 'Traveler',
        year: '2019',
        type: '1st Regular Album',
        tracks: [
            { title: 'Pretender', videoId: 'TQ8WlA2GXbk' },
            { title: 'Shukumei',  videoId: 'dummy6' },
            { title: 'Yesterday', videoId: 'dummy7' },
        ],
    },
    {
        id: 'escaparade-full',
        thumb: 'ESCAPARADE.jpg',
        name: 'Escaparade',
        year: '2018',
        type: '1st Full Album',
        tracks: [
            { title: 'Pretender', videoId: 'TQ8WlA2GXbk' },
            { title: 'Shukumei',  videoId: 'dummy6' },
            { title: 'Yesterday', videoId: 'dummy7' },
        ],
    },
    // ── 2페이지 (EP·미니앨범) ──────────────────────────────
    { id: 'universe',    thumb: 'Un', name: 'Universe',          year: '2021', type: 'EP',                tracks: [{ title: 'Universe',                        videoId: 'bt8wNQVaVsE' }] },
    { id: 'hello',       thumb: 'Hl', name: 'HELLO EP',          year: '2020', type: 'EP',                tracks: [{ title: 'HELLO',                           videoId: 'dummy5' }] },
    { id: 'standbyyou',  thumb: 'SY', name: 'Stand By You EP',   year: '2018', type: 'EP',                tracks: [{ title: 'Stand By You',                    videoId: 'dummy8' }] },
    { id: 'report',      thumb: 'Rp', name: 'Report',            year: '2017', type: '3rd Mini Album',    tracks: [{ title: 'Inu ka Cat ka...Kenka!',          videoId: 'dummy10' }] },
    { id: 'wgo',         thumb: 'Wg', name: "What's Going On?",  year: '2016', type: 'EP',                tracks: [{ title: "What's Going On?",                videoId: 'dummy11' }] },
    { id: 'maninmirror', thumb: 'MM', name: 'MAN IN THE MIRROR', year: '2016', type: '1st Mini Album',    tracks: [{ title: 'Coffee to Syrup',                 videoId: 'dummy12' }] },
    { id: 'lovetopeace', thumb: 'Lp', name: 'Love to Peace wa…',year: '2015', type: 'Debut Mini Album',  tracks: [{ title: 'SWEET TWEET',                     videoId: 'dummy13' }] },
];


const SINGLES = [
    { title: 'エルダーフラワー', year: '2026', videoSrc: 'videos/elder.mp4' },
    { title: 'Make Me Wonder',   year: '2026', videoId: 'wTDmqzeugx8' },
    { title: 'Sanitizer',        year: '2025', videoSrc: 'videos/sanitizer.mp4' },
    { title: 'らしさ',           year: '2025', videoSrc: 'videos/rashisa.mp4' },
    { title: '50%',              year: '2025', videoSrc: 'videos/50percent.mp4' },
    { title: 'Same Blue',        year: '2024', videoId: 'd0jg9hNHqn8' },
];


const CONCERTS = [
    {
        date:      '2026.06.14',
        venue:     'Osaka-jo Hall',
        city:      'Osaka',
        tour:      'TOUR 2026 — Same Blue',
        status:    'Upcoming',
        ticketUrl: 'https://w.pia.jp/',
    },
    {
        date:      '2026.06.21',
        venue:     'Makuhari Messe Hall',
        city:      'Chiba',
        tour:      'TOUR 2026 — Same Blue',
        status:    'Upcoming',
        ticketUrl: 'https://eplus.jp/sf/word/0000070368',
    },
    {
        date:      '2026.07.05',
        venue:     'KSPO Dome',
        city:      'Seoul',
        tour:      'ASIA TOUR 2026 — Same Blue',
        status:    'Upcoming',
        ticketUrl: 'https://tickets.interpark.com/contents/notice/detail/13341',
    },
    {
        date:      '2024.12.15',
        venue:     'Taipei Music Center',
        city:      'Taipei',
        tour:      'ASIA TOUR 2024 — Rejoice',
        status:    'Ended',
        ticketUrl: '',
    },
    {
        date:      '2024.12.01',
        venue:     'KINTEX Hall 5',
        city:      'Seoul',
        tour:      'ASIA TOUR 2024 — Rejoice',
        status:    'Ended',
        ticketUrl: '',
    },
    {
        date:      '2024.11.22',
        venue:     'Makomanai Ice Arena',
        city:      'Sapporo',
        tour:      'Arena Tour 2024 — Rejoice',
        status:    'Ended',
        ticketUrl: '',
    },
    {
        date:      '2024.11.13',
        venue:     'K-Arena Yokohama',
        city:      'Yokohama',
        tour:      'Arena Tour 2024 — Rejoice',
        status:    'Ended',
        ticketUrl: '',
    },
    {
        date:      '2024.11.12',
        venue:     'K-Arena Yokohama',
        city:      'Yokohama',
        tour:      'Arena Tour 2024 — Rejoice',
        status:    'Ended',
        ticketUrl: '',
    },
];


/* ============================================================
   4. 로더 (Loader)
   - 2초 후 로더를 fade-out으로 숨김
   ============================================================ */
function initLoader() {
    if (!dom.loader) return;
    // 2초 대기 후 로더 숨김 (애니메이션 충분히 보여주기)
    setTimeout(() => {
        dom.loader.classList.add('is-hidden');
    }, 2200);
}


/* ============================================================
   5. 파티클 시스템 (Particle Canvas)
   - 캔버스에 부유하는 점 입자들 렌더링
   ============================================================ */
function initParticles() {
    const canvas = dom.particleCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    // 파티클 생성 (두 가지 색상: 시안 & 골드)
    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        alpha: Math.random() * 0.4 + 0.05,
        // alternate between cyan and gold
        isCyan: i % 5 !== 0,
        twinkleSpeed: Math.random() * 0.008 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let frame = 0;

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);
        frame++;

        particles.forEach(p => {
            // Twinkle effect
            const twinkle = Math.sin(frame * p.twinkleSpeed + p.twinkleOffset);
            const alpha = p.alpha + twinkle * 0.12;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

            if (p.isCyan) {
                ctx.fillStyle = `rgba(0, 200, 240, ${Math.max(0, alpha)})`;
            } else {
                ctx.fillStyle = `rgba(201, 168, 76, ${Math.max(0, alpha * 0.7)})`;
            }

            ctx.fill();

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -5) p.x = W + 5;
            if (p.x > W + 5) p.x = -5;
            if (p.y < -5) p.y = H + 5;
            if (p.y > H + 5) p.y = -5;
        });

        requestAnimationFrame(drawParticles);
    }

    drawParticles();
}


/* ============================================================
   6. 커스텀 커서
   ============================================================ */
function initCursor() {
    document.addEventListener('mousemove', e => {
        state.cursor.mx = e.clientX;
        state.cursor.my = e.clientY;
    });

    function animateCursor() {
        const { mx, my } = state.cursor;
        let { rx, ry } = state.cursor;

        dom.cursor.style.left = `${mx}px`;
        dom.cursor.style.top  = `${my}px`;

        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        state.cursor.rx = rx;
        state.cursor.ry = ry;

        dom.cursorRing.style.left = `${rx}px`;
        dom.cursorRing.style.top  = `${ry}px`;

        state.rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button, [data-section], .album-card, .track-item, .concert-row--upcoming')) {
            dom.cursor.classList.add('cursor--expanded');
            dom.cursorRing.classList.add('cursor-ring--expanded');
        }
    });

    document.addEventListener('mouseout', e => {
        if (e.target.closest('a, button, [data-section], .album-card, .track-item, .concert-row--upcoming')) {
            dom.cursor.classList.remove('cursor--expanded');
            dom.cursorRing.classList.remove('cursor-ring--expanded');
        }
    });
}


/* ============================================================
   7. 유튜브 IFrame Player
   ============================================================ */
function initYouTube() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
    state.ytPlayer = new YT.Player('player', {
        videoId: 'd0jg9hNHqn8',
        playerVars: {
            autoplay: 0,
            mute: 0,
            loop: 1,
            playlist: 'd0jg9hNHqn8',
            controls: 0,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin,
            widget_referrer: window.location.origin,
        },
        events: {
            onReady(e) {
                e.target.setVolume(state.currentVolume);
                if (state.currentMode === 'youtube') {
                    e.target.playVideo();
                    updateMuteBtn(false);
                } else {
                    e.target.pauseVideo();
                }
            }
        },
    });
};


/* ============================================================
   8. 오디오 컨트롤
   ============================================================ */
function setVolume(vol) {
    state.currentVolume = vol;

    if (dom.localPlayer) {
        dom.localPlayer.volume = vol / 100;
        dom.localPlayer.muted  = vol === 0;
    }

    if (state.ytPlayer?.setVolume) state.ytPlayer.setVolume(vol);
    if (vol === 0) state.ytPlayer?.mute?.();
    else           state.ytPlayer?.unMute?.();

    updateMuteBtn(vol === 0);

    if (dom.volumeSlider) {
        dom.volumeSlider.style.background =
            `linear-gradient(to right, #C9A84C ${vol}%, rgba(240,234,214,0.12) ${vol}%)`;
    }
}

function toggleMute() {
    if (state.isMuted) {
        const restored = state.currentVolume > 0 ? state.currentVolume : 50;
        dom.volumeSlider.value = restored;
        setVolume(restored);
    } else {
        setVolume(0);
        dom.volumeSlider.value = 0;
    }
}

function updateMuteBtn(muted) {
    state.isMuted = muted;
    dom.musicBtn.classList.toggle('music-btn--muted', muted);
    dom.musicBtn.setAttribute('aria-pressed', String(muted));
    dom.musicBtn.setAttribute('aria-label', muted ? '음소거 해제' : '음소거');
}


/* ============================================================
   9. 트랙 재생
   ============================================================ */
function playTrack(videoId, videoSrc, title) {
    updateHomeTitle(title);

    if (videoId) {
        activateYouTubeMode(videoId);
    } else if (videoSrc) {
        activateLocalMode(videoSrc);
    }
}

function activateYouTubeMode(videoId) {
    state.currentMode = 'youtube';

    dom.localPlayer?.pause();
    dom.localLayer.hidden   = true;
    dom.youtubeLayer.hidden = false;

    state.ytPlayer?.loadVideoById?.(videoId);
    state.ytPlayer?.unMute?.();
    setVolume(state.currentVolume || 80);
}

function activateLocalMode(videoSrc) {
    state.currentMode = 'local';

    state.ytPlayer?.pauseVideo?.();
    dom.youtubeLayer.hidden = true;
    dom.localLayer.hidden   = false;

    if (dom.localPlayer) {
        dom.localPlayer.src   = videoSrc;
        dom.localPlayer.muted = false;
        dom.localPlayer.play();
        setVolume(state.currentVolume || 80);
    }
}

function updateHomeTitle(title) {
    if (!dom.homeTitle) return;

    if (!title) {
        dom.homeTitle.innerHTML = '<span class="home-title-label">Official</span>髭男dism';
        return;
    }

    const words = title.split(' ');

    if (words.length > 1) {
        dom.homeTitle.innerHTML = `${words[0]}<br><em>${words.slice(1).join(' ')}</em>`;
    } else {
        dom.homeTitle.innerHTML = `<em>${title}</em>`;
    }
}


/* ============================================================
   10. 렌더링 함수들
   ============================================================ */
const padNum = n => String(n).padStart(2, '0');
const isImageFile = str => str?.includes('.');


function renderAlbums(page) {
    if (!dom.albumGrid) return;

    const isMainPage = page === 1;
    const items = ALBUMS.filter(a => {
        const isMain = a.type.includes('Full') || a.type.includes('Regular');
        return isMainPage ? isMain : !isMain;
    });

    dom.albumGrid.innerHTML = items.map(album => `
        <div class="album-card" role="listitem"
             data-album-id="${album.id}"
             tabindex="0"
             aria-label="${album.name}, ${album.year}">
            <div class="album-thumb">
                ${isImageFile(album.thumb)
                    ? `<img src="${album.thumb}" alt="${album.name}" loading="lazy">`
                    : album.thumb}
            </div>
            <div class="album-name">${album.name}</div>
            <div class="album-year">${album.year}</div>
            <div class="album-type">${album.type}</div>
        </div>
    `).join('');

    renderPagination();
}

function renderPagination() {
    if (!dom.pagination) return;

    dom.pagination.innerHTML = [1, 2].map(i => `
        <button class="page-btn ${i === state.currentPage ? 'is-active' : ''}"
                data-page="${i}"
                aria-label="페이지 ${i}"
                aria-current="${i === state.currentPage}">
            0${i}
        </button>
    `).join('');
}

function renderSingles() {
    if (!dom.singleList) return;

    dom.singleList.innerHTML = SINGLES.map((track, i) => `
        <div class="track-item" role="listitem" tabindex="0"
             data-video-id="${track.videoId  || ''}"
             data-video-src="${track.videoSrc || ''}"
             data-title="${track.title}">
            <span class="track-num">${padNum(i + 1)}</span>
            <div class="track-info">
                <span class="track-title">${track.title}</span>
                <span class="track-year">${track.year} Release</span>
            </div>
            <span class="track-play-icon" aria-hidden="true">▶</span>
        </div>
    `).join('');
}

function renderConcerts() {
    if (!dom.concertList) return;

    dom.concertList.innerHTML = CONCERTS.map(con => {
        const [year, month, day] = con.date.split('.');
        const isUpcoming = con.status === 'Upcoming';

        const rowClass = isUpcoming && con.ticketUrl
            ? 'concert-row concert-row--upcoming'
            : 'concert-row concert-row--ended';

        const ticketAttr = con.ticketUrl ? `data-ticket-url="${con.ticketUrl}"` : '';

        return `
            <div class="${rowClass}" role="listitem" ${ticketAttr}>

                <div class="concert-date">
                    <span class="concert-date-year">${year}</span>
                    ${month}.${day}
                </div>

                <div class="concert-venue">
                    ${con.venue}
                    <span class="concert-city">${con.city}</span>
                </div>

                <div class="concert-tour">${con.tour}</div>

                <div class="concert-tag ${isUpcoming ? 'concert-tag--upcoming' : 'concert-tag--ended'}">
                    ${isUpcoming
                        ? `<svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor"
                               stroke-width="1.5" aria-hidden="true" style="margin-right:5px;vertical-align:-1px">
                               <path d="M6 1v5l3 2"/><circle cx="6" cy="6" r="5"/>
                           </svg>Upcoming`
                        : 'Ended'}
                </div>

                ${isUpcoming && con.ticketUrl
                    ? `<div class="concert-ticket-arrow" aria-hidden="true">
                           <svg width="13" height="10" viewBox="0 0 16 12" fill="none"
                                stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
                               <path d="M0 6H14M9 1L14 6L9 11"/>
                           </svg>
                           <span>예매하기</span>
                       </div>`
                    : ''}
            </div>
        `;
    }).join('');
}


function showAlbumDetail(albumId) {
    const album = ALBUMS.find(a => a.id === albumId);
    if (!album) return;

    dom.albumGrid.hidden   = true;
    dom.pagination.hidden  = true;
    dom.albumDetail.hidden = false;

    dom.detailThumb.innerHTML = isImageFile(album.thumb)
        ? `<img src="${album.thumb}" alt="${album.name}">`
        : album.thumb;

    dom.detailName.textContent = album.name;
    dom.detailInfo.textContent = `${album.year} · ${album.type}`;

    dom.trackList.innerHTML = album.tracks.map((track, i) => `
        <div class="track-item" role="listitem" tabindex="0"
             data-video-id="${track.videoId  || ''}"
             data-video-src="${track.videoSrc || ''}"
             data-title="${track.title}">
            <span class="track-num">${padNum(i + 1)}</span>
            <span class="track-title">${track.title}</span>
            <span class="track-play-icon" aria-hidden="true">▶</span>
        </div>
    `).join('');
}

function closeAlbumDetail() {
    dom.albumDetail.hidden = true;
    dom.albumGrid.hidden   = false;
    dom.pagination.hidden  = false;
}


/* ============================================================
   11. 라우팅 (섹션 전환)
   ─────────────────────────────────────────────────────────
   showSection(id):
     1) 모든 .section에서 section--active 제거
     2) 대상 섹션에 section--active 추가
     3) 홈 전환 시: main에 home-is-active 추가 → 스크롤 모드
        홈 외 전환 시: main에서 home-is-active 제거 → flex 중앙 정렬 복원
     4) #home-members-wrap 표시/숨김 (home 전용 스크롤 섹션)
     5) 네비 활성 상태 업데이트
     6) 필요한 렌더 함수 실행
   ============================================================ */
function showSection(id) {
    // 1·2) 섹션 활성화 전환
    dom.sections.forEach(s => s.classList.remove('section--active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('section--active');

    // 3) main 레이아웃 모드 전환
    //    홈: block(스크롤 가능) / 그 외: flex(중앙 정렬)
    const mainEl = document.getElementById('content-area');
    if (mainEl) {
        if (id === 'home') {
            mainEl.classList.add('home-is-active');
        } else {
            mainEl.classList.remove('home-is-active');
        }
    }

    // 4) 홈 전용 스크롤 멤버 섹션 표시/숨김
    const hmWrap = document.getElementById('home-members-wrap');
    if (hmWrap) {
        if (id === 'home') {
            hmWrap.classList.add('is-visible');
        } else {
            hmWrap.classList.remove('is-visible');
        }
    }

    // 5) 상태 저장 + 스크롤 힌트 표시/숨김
    state.currentSection = id;
    if (dom.scrollHint) {
        dom.scrollHint.style.visibility = id === 'home' ? 'visible' : 'hidden';
    }

    // 6) 네비 활성 클래스 업데이트
    dom.navLinks.forEach(a => {
        a.classList.toggle('is-active', a.dataset.section === id);
    });

    // 7) 섹션별 동적 렌더링
    const renders = {
        members:  () => {},          // 정적 HTML — 렌더 불필요
        singles:  renderSingles,
        concerts: renderConcerts,
        albums:   () => {
            closeAlbumDetail();
            renderAlbums(state.currentPage);
        },
    };
    renders[id]?.();
}


/* ============================================================
   12. 이벤트 위임
   ============================================================ */
function initEvents() {

    document.addEventListener('click', e => {

        const navEl = e.target.closest('[data-section]');
        if (navEl) {
            e.preventDefault();
            const section = navEl.dataset.section;
            if (section) showSection(section);
            return;
        }

        if (e.target.closest('#detailBackBtn')) {
            closeAlbumDetail();
            return;
        }

        const card = e.target.closest('.album-card');
        if (card) {
            showAlbumDetail(card.dataset.albumId);
            return;
        }

        const trackItem = e.target.closest('.track-item');
        if (trackItem) {
            playTrack(
                trackItem.dataset.videoId  || null,
                trackItem.dataset.videoSrc || null,
                trackItem.dataset.title    || null,
            );
            return;
        }

        const concertRow = e.target.closest('.concert-row--upcoming');
        if (concertRow && concertRow.dataset.ticketUrl) {
            window.open(concertRow.dataset.ticketUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        const pageBtn = e.target.closest('.page-btn');
        if (pageBtn) {
            state.currentPage = Number(pageBtn.dataset.page);
            renderAlbums(state.currentPage);
            return;
        }

        if (e.target.closest('#musicBtn')) {
            toggleMute();
        }
    });

    document.addEventListener('keydown', e => {
        if (!['Enter', ' '].includes(e.key)) return;
        const interactive = e.target.closest('.album-card, .track-item, .concert-row--upcoming');
        if (interactive) {
            e.preventDefault();
            interactive.click();
        }
    });

    dom.volumeSlider?.addEventListener('input', e => {
        setVolume(Number(e.target.value));
    });
}



/* ============================================================
   14. 홈 스크롤 멤버 애니메이션 (IntersectionObserver)
   ─────────────────────────────────────────────────────────
   #home-members-wrap 내의 각 .member-card와 .hm-heading을
   뷰포트 진입 시 순차적으로 fadein+slideup.
   
   딜레이 조정: 각 카드의 setTimeout delay 값(ms) 변경
   threshold 조정: ioOptions.threshold (0~1, 기본 0.15)
   ============================================================ */
function initMembersScroll() {
    const wrap = document.getElementById('home-members-wrap');
    if (!wrap) return;

    // IntersectionObserver 옵션
    const ioOptions = {
        threshold: 0.15,    // 카드의 15%가 보일 때 트리거
        rootMargin: '0px',
    };

    // 헤딩 옵저버 (카드보다 먼저 등장)
    const headingEl = document.getElementById('hmHeading');
    if (headingEl) {
        const headingIo = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    headingIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        headingIo.observe(headingEl);
    }

    // 카드 옵저버 (뷰포트 진입 시 순차 등장)
    const cardIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                // 카드 인덱스(0-based) → 딜레이 계산
                const cards = [...wrap.querySelectorAll('.member-card')];
                const idx   = cards.indexOf(card);
                const delay = idx * 130;   // ← 딜레이(ms) 조정 가능

                setTimeout(() => {
                    card.classList.add('is-visible');
                }, delay);

                cardIo.unobserve(card);    // 한 번만 트리거
            }
        });
    }, ioOptions);

    // 모든 카드 등록
    wrap.querySelectorAll('.member-card').forEach(card => {
        cardIo.observe(card);
    });
}
/* ============================================================
   13. 초기화
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    initLoader();                        // 로더 애니메이션 후 숨김
    initParticles();                     // 파티클 캔버스 시작
    initCursor();                        // 커스텀 커서 시작
    initYouTube();                       // 유튜브 API 스크립트 삽입
    initEvents();                        // 이벤트 위임 등록
    renderAlbums(state.currentPage);     // 앨범 그리드 초기 렌더링

    setVolume(100);                      // 볼륨 초기화

    // 🎯 첫 화면 배경 영상 설정 (타이틀은 髭男dism 기본값 유지)
    //playTrack(null, 'videos/higedanop.mp4', null);

    // 💡 유튜브 영상으로 변경하려면:
     playTrack('d0jg9hNHqn8', null, 'Same Blue');

    // ── 홈 진입 시 main 스크롤 모드 활성화 (초기 상태: home이 활성) ──
    const mainEl = document.getElementById('content-area');
    if (mainEl) mainEl.classList.add('home-is-active');
    const hmWrap = document.getElementById('home-members-wrap');
    if (hmWrap) hmWrap.classList.add('is-visible');

    initMembersScroll();   // 스크롤 멤버 카드 IntersectionObserver 등록
});
document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enter-btn');
  const introScreen = document.getElementById('intro-screen');
  const bgm = document.getElementById('myAudio');

  // 입장 버튼을 클릭했을 때
  enterBtn.addEventListener('click', () => {
    // 1. 음악을 재생합니다.
    bgm.play();
    
    // 2. 인트로 화면을 부드럽게 사라지게 합니다.
    introScreen.classList.add('fade-out');
    
    // 3. (선택사항) 일정 시간 뒤에 인트로 화면을 HTML에서 완전히 숨김
    setTimeout(() => {
      introScreen.style.display = 'none';
    }, 800);
  });
});

