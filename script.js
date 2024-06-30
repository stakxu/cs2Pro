document.addEventListener('DOMContentLoaded', function () {
    // 获取今天的日期
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0]; // 格式化为YYYY-MM-DD

    // 获取今天的比赛数据
    fetch(`cs2Pro/data/${todayFormatted}-cs2.json`)
        .then(response => {
            if (response.status === 404) {
                return null; // 若没有数据文件，返回 null
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                renderTodayMatches(data);
            } else {
                renderNoMatches();
            }
        })
        .catch(error => {
            console.error('加载数据出错', error);
        });

    // 渲染今天的比赛数据
    function renderTodayMatches(data) {
        const contentContainer = document.getElementById('content-container');
        contentContainer.innerHTML = ''; // 清空内容

        const title = document.createElement('title');
        title.textContent = `今天的比赛记录 (${todayFormatted})`;
        document.head.appendChild(title);

        const h1 = document.createElement('h1');
        h1.textContent = `今天的比赛记录 (${todayFormatted})`;
        contentContainer.appendChild(h1);

        Object.keys(data).forEach(nickname => {
            const matches = data[nickname];
            const matchesHTML = matches.map(match => `
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title"><a href="https://demos-europe-west2.faceit-cdn.net/cs2/${match.matchId}-1-1.dem.gz">${match.matchId}</a></h5>
                                <p class="card-text">创建时间: ${new Date(match.created_at).toLocaleString()}</p>
                                <p class="card-text">胜负: ${match.i10 === '1' ? '胜利' : '失败'}</p>
                                <p class="card-text">地图: ${match.i1}</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card-body">
                                <p class="card-text">KD值: ${match.i6} / ${match.i8}</p>
                                <p class="card-text">K/D Ratio: ${match.c2}</p>
                                <p class="card-text">爆头率: ${match.c4}</p>
                                <p class="card-text">比分: ${match.i18}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            const playerMatchesHTML = `
                <div class="mb-4">
                    <h3>${nickname}</h3>
                    ${matchesHTML}
                </div>
            `;

            contentContainer.insertAdjacentHTML('beforeend', playerMatchesHTML);
        });
    }

    function renderNoMatches() {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = ''; // 清空内容

    const title = document.createElement('title');
    title.textContent = `今天没有选手进行比赛 (${todayFormatted})`;
    document.head.appendChild(title);

    const h1 = document.createElement('h1');
    h1.textContent = `今天没有选手进行比赛 (${todayFormatted})`;
    contentContainer.appendChild(h1);
    }
});
