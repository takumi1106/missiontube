// =========================
// セーブデータ
// =========================
const save1 = document.getElementById("save1");
const save2 = document.getElementById("save2");
const save3 = document.getElementById("save3");
const deleteSaveBtn = document.getElementById("delete-save-btn");

let deleteMode = false;

function getSaveData(saveKey) {
    const savedText = localStorage.getItem(saveKey);

    if (!savedText) {
        return null;
    }

    return JSON.parse(savedText);
}

function saveSaveData(saveKey, data) {
    localStorage.setItem(saveKey, JSON.stringify(data));
}

function getCurrentSaveData() {
    const currentSave = localStorage.getItem("currentSave");

    if (!currentSave) {
        return null;
    }

    return getSaveData(currentSave);
}

function getMissionHistory() {
    const saveData = getCurrentSaveData();

    if (!saveData) {
        return [];
    }

    if (!Array.isArray(saveData.missionHistory)) {
        saveData.missionHistory = [];
    }

    return saveData.missionHistory;
}

function saveMissionHistory(missionHistory) {
    const currentSave = localStorage.getItem("currentSave");

    if (!currentSave) {
        return;
    }

    const saveData = getSaveData(currentSave);

    if (!saveData) {
        return;
    }

    saveData.missionHistory = missionHistory;

    saveSaveData(currentSave, saveData);
}

function displaySaveData(saveKey, button) {
    if (!button) {
        return;
    }

    const saveData = getSaveData(saveKey);
    const jobText = button.querySelector(".save-job");
    const typeText = button.querySelector(".save-type");

    if (saveData) {
    jobText.textContent = `職種：${saveData.job}`;
    typeText.textContent = `属性：${saveData.type}`;

    button.classList.remove("empty");
    button.classList.add("is-created");
    } else {
    jobText.textContent = "設定されていません";
    typeText.textContent = "";

    button.classList.add("empty");
    button.classList.remove("is-created");
    }
}

function deleteSaveData(saveKey) {
    const saveData = getSaveData(saveKey);

    if (!saveData) {
        alert("このセーブデータは設定されていません。");
        return;
    }

    const result = confirm("このセーブデータを削除しますか？");

    if (!result) {
        return;
    }

    localStorage.removeItem(saveKey);

    if (localStorage.getItem("currentSave") === saveKey) {
        localStorage.removeItem("currentSave");
    }

    location.reload();
}

function selectSaveData(saveKey) {
    if (deleteMode) {
        deleteSaveData(saveKey);
        return;
    }

    localStorage.setItem("currentSave", saveKey);

    const saveData = getSaveData(saveKey);

    if (saveData) {
        localStorage.setItem("type", saveData.type);
        localStorage.setItem("job", saveData.job);

        location.href = "mission.html";
    } else {
        location.href = "type.html";
    }
}

if (save1) {
    displaySaveData("save1", save1);

    save1.addEventListener("click", function () {
        selectSaveData("save1");
    });
}

if (save2) {
    displaySaveData("save2", save2);

    save2.addEventListener("click", function () {
        selectSaveData("save2");
    });
}

if (save3) {
    displaySaveData("save3", save3);

    save3.addEventListener("click", function () {
        selectSaveData("save3");
    });
}

/* 削除ボタン */
if (deleteSaveBtn) {
    deleteSaveBtn.addEventListener("click", function () {
        deleteMode = !deleteMode;

        if (deleteMode) {
            deleteSaveBtn.textContent = "キャンセル";
            document.body.classList.add("is-delete-mode");
            alert("削除するセーブデータを選択してください。");
        } else {
            deleteSaveBtn.textContent = "削除";
            document.body.classList.remove("is-delete-mode");
        }
    });
}

// =========================
// タイプ入力
// =========================
/* 職種決定時にセーブデータを作成 */
const typeForm = document.getElementById("type-form");
const typeInput = document.getElementById("type-input");

if (typeForm) {
    typeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const type = typeInput.value.trim();

        if (type === "") {
            alert("属性を入力してください。");
            return;
        }

        localStorage.setItem("type", type);
        location.href = "job.html";
    });
}

const typeBackBtn = document.getElementById("type-back-btn");

if (typeBackBtn) {
    typeBackBtn.addEventListener("click", function () {
        location.href = "index.html";
    });
}

// =========================
// 職種入力
// =========================
const jobForm = document.getElementById("job-form");
const jobNameInput = document.getElementById("job-name");
const jobBackBtn = document.getElementById("job-back-btn");

// job.htmlを直接開いた場合のチェック
if (jobForm) {
    const currentSave = localStorage.getItem("currentSave");
    const type = localStorage.getItem("type");

    if (!currentSave) {
        alert("セーブデータが選択されていません。");
        location.href = "index.html";
    } else if (!type) {
        alert("属性が入力されていません。");
        location.href = "type.html";
    }
}

function createSaveData(job) {
    const currentSave = localStorage.getItem("currentSave");
    const type = localStorage.getItem("type");

    const saveData = {
        type: type,
        job: job,
        missionHistory: [],
        recommendedVideos: []
    };

    localStorage.setItem(currentSave, JSON.stringify(saveData));

    return true;
}

if (jobForm) {
    jobForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const job = jobNameInput.value.trim();

        if (job === "") {
            alert("職種を入力してください。");
            return;
        }

        if (createSaveData(job)) {
            location.href = "mission.html";
        }
    });
}

if (jobBackBtn) {
    jobBackBtn.addEventListener("click", function () {
        location.href = "type.html";
    });
}

// =========================
// ミッション入力・履歴表示
// =========================
const missionForm = document.getElementById("mission-form");
const missionInput = document.getElementById("type-input");
const missionBackBtn = document.getElementById("mission-back-btn");
const missionHistoryList = document.getElementById("mission-history");
const missionDeleteBtn = document.getElementById("mission-delete-btn");

let missionDeleteMode = false;

// 過去のミッションを表示
if (missionHistoryList) {
    const missionHistory = getMissionHistory();

    missionHistory.forEach(function (mission, index) {
        const li = document.createElement("li");
        li.classList.add("mission__history-item");

        const selectBtn = document.createElement("button");
        selectBtn.type = "button";
        selectBtn.classList.add("mission__select-btn");
        selectBtn.textContent = mission;

        selectBtn.addEventListener("click", function () {
            if (missionDeleteMode) {
                const result = confirm(
                    `「${mission}」を削除しますか？`
                );

                if (!result) {
                    return;
                }

                missionHistory.splice(index, 1);
                saveMissionHistory(missionHistory);

                location.reload();
                return;
            }

            localStorage.setItem("mission", mission);
            location.href = "timer.html";
        });

        li.appendChild(selectBtn);
        missionHistoryList.appendChild(li);
    });
}

// 削除モード切り替え
if (missionDeleteBtn) {
    missionDeleteBtn.addEventListener("click", function () {
        missionDeleteMode = !missionDeleteMode;

        if (missionDeleteMode) {
            missionDeleteBtn.textContent = "キャンセル";
            document.body.classList.add("is-mission-delete-mode");
        } else {
            missionDeleteBtn.textContent = "削除";
            document.body.classList.remove("is-mission-delete-mode");
        }
    });
}

// 新しいミッションを登録
if (missionForm) {
    missionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const mission = missionInput.value.trim();

        if (mission === "") {
            alert("ミッションを入力してください。");
            return;
        }

        const missionHistory = getMissionHistory();

        if (!missionHistory.includes(mission)) {
            missionHistory.push(mission);
            saveMissionHistory(missionHistory);
        }

        localStorage.setItem("mission", mission);

        location.href = "timer.html";
    });
}

// 戻るボタン
if (missionBackBtn) {
    missionBackBtn.addEventListener("click", function () {
        location.href = "job.html";
    });
}
// 制限時間設定
const missionMinuteInput = document.getElementById("mission-minute");
const missionSecondInput = document.getElementById("mission-second");
const timerDecisionBtn = document.getElementById("timer-decision-btn");
const timerBackBtn = document.getElementById("timer-back-btn");

if (timerDecisionBtn) {
    timerDecisionBtn.addEventListener("click", function () {
        const minute = Number(missionMinuteInput.value);
        const second = Number(missionSecondInput.value);

        if (minute === 0 && second === 0) {
            alert("制限時間を設定してください。");
            return;
        }

        if (second < 0 || second > 59) {
            alert("秒は0～59の間で入力してください。");
            return;
        }

        const missionTime = minute * 60 + second;

        localStorage.setItem("missionTime", missionTime);

        // 前回の作業時間を消す
        localStorage.removeItem("missionRemainingTime");

        location.href = "reward.html";
    });
}

if (timerBackBtn) {
    timerBackBtn.addEventListener("click", function () {
        location.href = "mission.html";
    });
}

// 獲得動画時間設定
const rewardMinuteInput = document.getElementById("reward-minute");
const rewardSecondInput = document.getElementById("reward-second");
const rewardDecisionBtn = document.getElementById("reward-decision-btn");
const rewardBackBtn = document.getElementById("reward-back-btn");

if (rewardDecisionBtn) {
    rewardDecisionBtn.addEventListener("click", function () {

        const minute = Number(rewardMinuteInput.value);
        const second = Number(rewardSecondInput.value);

        // 0分0秒は不可
        if (minute === 0 && second === 0) {
            alert("追加動画時間を設定してください。");
            return;
        }

        // 秒は0～59まで
        if (second < 0 || second > 59) {
            alert("秒は0～59の間で入力してください。");
            return;
        }

        // 秒に変換
        const rewardTime = minute * 60 + second;

        localStorage.setItem("rewardTime", rewardTime);

        location.href = "playlist.html";
    });
}

if (rewardBackBtn) {
    rewardBackBtn.addEventListener("click", function () {
        location.href = "timer.html";
    });
}

// 再生リスト作成
const playlistDecisionBtn =
    document.getElementById("playlist-decision-btn");

const recommendedVideoList =
    document.getElementById("recommended-video-list");

const recommendedVideosSection =
    document.getElementById("recommended-videos");

const videoListTitle =
    document.getElementById("video-list-title");

const selectedDeleteBtn =
    document.getElementById("selected-delete-btn");

let selectedDeleteMode = false;
let selectedVideos = [];

const playlistBackBtn = document.getElementById("playlist-back-btn");

if (playlistBackBtn) {
    playlistBackBtn.addEventListener("click", function () {
        location.href = "reward.html";
    });
}

// 選択した動画を画面に追加する関数
function addSelectedVideo(video) {
    if (selectedVideos.some(function (v) {
        return v.id === video.id;
    })) {
        alert("この動画はすでに選択されています。");
        return;
    }

    selectedVideos.push(video);

    const li = document.createElement("li");
    li.classList.add("selected-video__item");

    const img = document.createElement("img");
    img.classList.add("selected-video__image");
    img.src = video.thumbnail;
    img.alt = video.title;
    img.width = 120;

    const titleSpan = document.createElement("span");
    titleSpan.classList.add("selected-video__title");
    titleSpan.textContent = video.title;

    li.appendChild(img);
    li.appendChild(titleSpan);
    selectedVideoList.appendChild(li);

    // 動画が追加されたら削除ボタンを表示
    if (selectedDeleteBtn) {
        selectedDeleteBtn.classList.remove("is-hidden");
    }

    li.addEventListener("click", function () {
    if (!selectedDeleteMode) {
        return;
    }

    selectedVideos = selectedVideos.filter(function (v) {
        return v.id !== video.id;
    });

    li.remove();

    // 動画が0件になったら削除ボタンを非表示
    if (selectedVideos.length === 0 && selectedDeleteBtn) {
        selectedDeleteBtn.classList.add("is-hidden");
        selectedDeleteMode = false;
        selectedDeleteBtn.textContent = "削除";
        selectedVideoList.classList.remove("is-delete-mode");
    }
});
}

if (selectedDeleteBtn) {
    selectedDeleteBtn.addEventListener("click", function () {
        selectedDeleteMode = !selectedDeleteMode;

        if (selectedDeleteMode) {
            selectedDeleteBtn.textContent = "キャンセル";
            selectedVideoList.classList.add("is-delete-mode");
        } else {
            selectedDeleteBtn.textContent = "削除";
            selectedVideoList.classList.remove("is-delete-mode");
        }
    });
}

// おすすめ動画を表示
if (recommendedVideoList) {
    const currentSave = localStorage.getItem("currentSave");
    const saveData = currentSave ? getSaveData(currentSave) : null;

    const recommendedVideos =
        saveData && Array.isArray(saveData.recommendedVideos)
            ? saveData.recommendedVideos
            : [];

    if (videoListTitle) {
    if (recommendedVideos.length > 0) {
        videoListTitle.textContent = "履歴";
        videoListTitle.classList.remove("is-hidden");
    } else {
        videoListTitle.classList.add("is-hidden");
    }
}

    recommendedVideos.forEach(function (video) {
    const card = document.createElement("div");
    card.classList.add("video-card");

    const img = document.createElement("img");
    img.classList.add("video-card__image");
    img.src = video.thumbnail;
    img.alt = video.title;

    const title = document.createElement("p");
    title.classList.add("video-card__title");
    title.textContent = video.title;

    const duration = document.createElement("p");
    duration.classList.add("video-card__duration");
    duration.textContent = `動画時間 ${formatYouTubeDuration(video.duration)}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(duration);

    card.addEventListener("click", function () {
        addSelectedVideo(video);
    });

    recommendedVideoList.appendChild(card);
});
}

// 完了ボタン
if (playlistDecisionBtn) {
    playlistDecisionBtn.addEventListener("click", function () {
        if (selectedVideos.length === 0) {
            alert("再生する動画を1つ以上選択してください。");
            return;
        }

        const currentSave = localStorage.getItem("currentSave");
        const saveData = currentSave ? getSaveData(currentSave) : null;

        if (!currentSave || !saveData) {
            alert("セーブデータが見つかりません。");
            location.href = "index.html";
            return;
        }

        // 今回の再生リスト
        localStorage.setItem(
            "playlist",
            JSON.stringify(selectedVideos)
        );

        if (!Array.isArray(saveData.recommendedVideos)) {
            saveData.recommendedVideos = [];
        }

        selectedVideos.forEach(function (video) {
            const alreadySaved = saveData.recommendedVideos.some(
                function (savedVideo) {
                    return savedVideo.id === video.id;
                }
            );

            if (!alreadySaved) {
                saveData.recommendedVideos.push(video);
            }
        });

        // 現在のセーブデータへ保存
        saveSaveData(currentSave, saveData);

        location.href = "confirm.html";
    });
}

// 再生リスト確認
const playlist = document.getElementById("playlist");
const startBtn = document.getElementById("start-btn");
const repeat = document.getElementById("repeat");
const confirmBackBtn = document.getElementById("confirm-back-btn");

if (playlist) {
    const videos = JSON.parse(localStorage.getItem("playlist")) || [];

    videos.forEach(function (video) {
        const li = document.createElement("li");
        li.classList.add("confirm-video__item");
        li.dataset.id = video.id;

        const handle = document.createElement("span");
        handle.textContent = "☰";
        handle.classList.add("confirm-video__handle");

        const img = document.createElement("img");
        img.classList.add("confirm-video__image");
        img.src = video.thumbnail;
        img.alt = video.title;

        const titleSpan = document.createElement("span");
        titleSpan.classList.add("confirm-video__title");
        titleSpan.textContent = video.title;

        li.appendChild(handle);
        li.appendChild(img);
        li.appendChild(titleSpan);

        playlist.appendChild(li);
    });

    if (typeof Sortable !== "undefined") {
        new Sortable(playlist, {
            animation: 150,

            onEnd: function () {
                const savedVideos =
                    JSON.parse(localStorage.getItem("playlist")) || [];

                const newPlaylist = [];

                playlist.querySelectorAll("li").forEach(function (li) {
                    const videoId = li.dataset.id;

                    const video = savedVideos.find(function (item) {
                        return item.id === videoId;
                    });

                    if (video) {
                        newPlaylist.push(video);
                    }
                });

                localStorage.setItem(
                    "playlist",
                    JSON.stringify(newPlaylist)
                );
            }
        });
    }
}

if (startBtn) {
    startBtn.addEventListener("click", function () {
        localStorage.setItem("repeat", repeat.checked);

        // 新しい作業開始なので、残り時間を設定時間に戻す
        const missionTime =
            Number(localStorage.getItem("missionTime")) || 600;

        localStorage.setItem(
            "missionRemainingTime",
            String(missionTime)
        );

        location.href = "player.html";
    });
}

if (confirmBackBtn) {
    confirmBackBtn.addEventListener("click", function () {
        location.href = "playlist.html";
    });
}

// =========================
// 動画を検索
// =========================
const videoSearchInput = document.getElementById("video-search");
const searchVideoBtn = document.getElementById("search-video-btn");
const videoList = document.getElementById("video-list");
const selectedVideoList = document.getElementById("selected-video-list");

function formatYouTubeDuration(duration) {
    if (!duration) {
        return "不明";
    }

    const match = duration.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );

    if (!match) {
        return "不明";
    }

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);

    if (hours > 0) {
        return `${hours}時間${minutes}分${seconds}秒`;
    }

    if (minutes > 0) {
        return `${minutes}分${seconds}秒`;
    }

    return `${seconds}秒`;
}

function searchVideo() {
    const keyword = videoSearchInput.value.trim();

    if (keyword === "") {
        alert("検索キーワードを入力してください。");
        return;
    }

    searchSampleVideos(keyword);
}

if (
    searchVideoBtn &&
    videoSearchInput &&
    videoList &&
    selectedVideoList
) {
    searchVideoBtn.addEventListener("click", searchVideo);

    videoSearchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchVideo();
        }
    });
}

function searchSampleVideos(keyword) {
    if (recommendedVideosSection) {
        recommendedVideosSection.hidden = true;
    }

    fetch(`/api/search?q=${encodeURIComponent(keyword)}`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("sample.jsonを読み込めませんでした。");
            }

            return response.json();
        })
        .then(function (data) {
            videoList.innerHTML = "";

            if (videoListTitle) {
                videoListTitle.textContent = "検索結果";
                videoListTitle.classList.remove("is-hidden");
            }

            const searchWord = keyword.toLowerCase();

            const filteredItems = data.items.filter(function (item) {
                const title = item.snippet.title.toLowerCase();

                return title.includes(searchWord);
            });

            if (filteredItems.length === 0) {
                videoList.textContent = "該当する動画がありません。";
                return;
            }

        filteredItems.forEach(function (item) {
            const videoData = {
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                duration: item.duration
            };

            const card = document.createElement("div");
            card.classList.add("video-card");

            const img = document.createElement("img");
            img.classList.add("video-card__image");
            img.src = videoData.thumbnail;
            img.alt = videoData.title;

            const title = document.createElement("p");
            title.classList.add("video-card__title");
            title.textContent = videoData.title;

            const duration = document.createElement("p");
            duration.classList.add("video-card__duration");
            duration.textContent = `動画時間 ${formatYouTubeDuration(videoData.duration)}`;

            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(duration);

            card.addEventListener("click", function () {
                addSelectedVideo(videoData);
            });

            videoList.appendChild(card);
        });
        })
        .catch(function (error) {
            console.error(error);
            alert("サンプル動画の読み込みに失敗しました。");
        });
}

// =========================
// YouTubeプレイヤー
// =========================
let youtubePlayer = null;
let playerPlaylist = [];
let currentVideoIndex = 0;
let videoLocked = false;

function onYouTubeIframeAPIReady() {
    console.log("YouTube API準備完了");

    const videoPlayerElement =
        document.getElementById("video-player");

    console.log("プレイヤー要素:", videoPlayerElement);

    if (!videoPlayerElement) {
        return;
    }

    playerPlaylist =
        JSON.parse(localStorage.getItem("playlist")) || [];

    console.log("再生リスト:", playerPlaylist);

    if (playerPlaylist.length === 0) {
        videoPlayerElement.textContent =
            "再生する動画が設定されていません。";
        return;
    }

    youtubePlayer = new YT.Player("video-player", {
        width: "100%",
        height: "100%",
        videoId: playerPlaylist[0].id,

        playerVars: {
            autoplay: 1,
            controls: 1
        },

        events: {
            onReady: function () {
                console.log("YouTubeプレイヤー準備完了");
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}

function handlePlayerStateChange(event) {
    if (
        event.data === YT.PlayerState.PLAYING &&
        videoLocked
    ) {
        youtubePlayer.pauseVideo();
        return;
    }

    if (
        event.data === YT.PlayerState.ENDED &&
        !videoLocked
    ) {
        playNextVideo();
    }
}

function playNextVideo() {
    if (!youtubePlayer || playerPlaylist.length === 0) {
        return;
    }

    const repeat =
        localStorage.getItem("repeat") === "true";

    currentVideoIndex++;

    if (currentVideoIndex >= playerPlaylist.length) {
        if (repeat) {
            currentVideoIndex = 0;
        } else {
            youtubePlayer.stopVideo();
            return;
        }
    }

    youtubePlayer.loadVideoById(
        playerPlaylist[currentVideoIndex].id
    );
}

function handlePlayerError(event) {
    console.error(
        "YouTubeプレイヤーエラー：",
        event.data
    );

    playNextVideo();
}

// =========================
// 作業中画面
// =========================
const missionDisplay = document.getElementById("mission-display");
const missionTimeDisplay = document.getElementById("mission-time-display");
const missionCompleteBtn = document.getElementById("mission-complete-btn");
const nextMissionArea = document.querySelector(".next-mission-area");
const nextMissionNameInput = document.getElementById("next-mission-name");
const nextMissionBtn = document.getElementById("next-mission-btn");
const playerBackBtn = document.getElementById("player-back-btn");
const endPlayBtn = document.getElementById("end-play-btn");
const videoOverlay = document.getElementById("video-overlay");
const videoOverlayText = document.getElementById("video-overlay-text");

if (missionDisplay) {
    const mission = localStorage.getItem("mission");

    const missionTime =
        Number(localStorage.getItem("missionTime")) || 600;

    const rewardTime =
        Number(localStorage.getItem("rewardTime")) || 30;

    const savedRemainingTime =
    localStorage.getItem("missionRemainingTime");

    let missionRemainingTime =
        savedRemainingTime === null
            ? missionTime
            : Number(savedRemainingTime);

    if (
        !Number.isFinite(missionRemainingTime) ||
        missionRemainingTime < 0
    ) {
        missionRemainingTime = missionTime;
    }

    let missionTimer = null;
    let isLeavingPlayerPage = false;

    missionDisplay.textContent =
        mission || "ミッションが設定されていません";

    function showMissionTime() {
    const minutes = Math.floor(missionRemainingTime / 60);
    const seconds = missionRemainingTime % 60;

    missionTimeDisplay.textContent =
        `${minutes}分${seconds.toString().padStart(2, "0")}秒`;

    missionTimeDisplay.classList.remove(
        "is-warning",
        "is-danger"
    );

    if (missionRemainingTime <= 10) {
        missionTimeDisplay.classList.add("is-danger");
    } else if (missionRemainingTime <= 30) {
        missionTimeDisplay.classList.add("is-warning");
    }
}

    function stopTimer() {
        if (missionTimer !== null) {
            clearInterval(missionTimer);
            missionTimer = null;
        }
    }

    function cleanupPlayerPage() {
        isLeavingPlayerPage = true;
        stopTimer();

        if (
            youtubePlayer &&
            typeof youtubePlayer.pauseVideo === "function"
        ) {
            youtubePlayer.pauseVideo();
        }
    }

    window.addEventListener("pagehide", cleanupPlayerPage);
    window.addEventListener("beforeunload", cleanupPlayerPage);

    function lockVideo(message) {
        if (
            youtubePlayer &&
            typeof youtubePlayer.pauseVideo === "function"
        ) {
            youtubePlayer.pauseVideo();
        }

        if (videoOverlay) {
            videoOverlay.classList.add("is-locked");
        }

        if (videoOverlayText) {
            videoOverlayText.innerHTML = message;
        }

        const youtubeIframe =
            document.querySelector("#video-player iframe");

        if (youtubeIframe) {
            youtubeIframe.style.pointerEvents = "none";
        }
    }

    function unlockVideo() {
        if (videoOverlay) {
            videoOverlay.classList.remove("is-locked");
        }

        const youtubeIframe =
            document.querySelector("#video-player iframe");

        if (youtubeIframe) {
            youtubeIframe.style.pointerEvents = "auto";
        }

        if (
            youtubePlayer &&
            typeof youtubePlayer.playVideo === "function"
        ) {
            youtubePlayer.playVideo();
        }
    }

    function startTimer() {
        stopTimer();
        isLeavingPlayerPage = false;

    // すでに時間切れならタイマーを開始しない
    if (missionRemainingTime <= 0) {
        missionRemainingTime = 0;

        localStorage.setItem(
            "missionRemainingTime",
            "0"
        );

        showMissionTime();

        lockVideo(
            "時間切れです<br>次のミッションを設定してください"
        );

        missionTimeDisplay.textContent = "時間切れ";
        return;
    }

    missionTimer = setInterval(function () {
        if (isLeavingPlayerPage) {
            stopTimer();
            return;
        }

        missionRemainingTime--;

        if (missionRemainingTime <= 0) {
            missionRemainingTime = 0;

            localStorage.setItem(
                "missionRemainingTime",
                "0"
            );

            showMissionTime();
            stopTimer();

            lockVideo(
                "時間切れです<br>次のミッションを設定してください"
            );

            missionTimeDisplay.textContent = "時間切れ";

            alert(
                "制限時間を過ぎました。動画再生が停止します。"
            );

            return;
        }

        localStorage.setItem(
            "missionRemainingTime",
            String(missionRemainingTime)
        );

        showMissionTime();
    }, 1000);
}

    showMissionTime();
    startTimer();

    if (missionCompleteBtn) {
        missionCompleteBtn.addEventListener("click", function () {
            stopTimer();

            missionCompleteBtn.disabled = true;

            lockVideo("次のミッションを入力してください");

            missionRemainingTime += rewardTime;

            localStorage.setItem(
                "missionRemainingTime",
                String(missionRemainingTime)
            );

            showMissionTime();

            if (nextMissionArea) {
                nextMissionArea.hidden = false;
            }

            if (nextMissionNameInput) {
                nextMissionNameInput.focus();
            }
        });
    }

    if (nextMissionBtn) {
        nextMissionBtn.addEventListener("click", function () {
            const nextMission = nextMissionNameInput.value.trim();

            if (nextMission === "") {
                alert("次のミッションを入力してください。");
                return;
            }

            localStorage.setItem("mission", nextMission);

            const missionHistory = getMissionHistory();

            if (!missionHistory.includes(nextMission)) {
                missionHistory.push(nextMission);
                saveMissionHistory(missionHistory);
            }

            missionDisplay.textContent = nextMission;
            nextMissionNameInput.value = "";

            if (nextMissionArea) {
                nextMissionArea.hidden = true;
            }

            missionCompleteBtn.disabled = false;

            unlockVideo();
            startTimer();
        });
    }

    if (endPlayBtn) {
        endPlayBtn.addEventListener("click", function () {
            cleanupPlayerPage();

            if (
                youtubePlayer &&
                typeof youtubePlayer.stopVideo === "function"
            ) {
                youtubePlayer.stopVideo();
            }

            localStorage.removeItem("mission");
            localStorage.removeItem("missionTime");
            localStorage.removeItem("rewardTime");
            localStorage.removeItem("missionRemainingTime");
            localStorage.removeItem("playlist");

            alert("お疲れ様でした！");
            location.href = "index.html";
        });
    }

    if (playerBackBtn) {
        playerBackBtn.addEventListener("click", function () {
            cleanupPlayerPage();
            location.href = "confirm.html";
        });
    }
}