(function () {
  const STORAGE_KEY = 'xs_admin_token';
  const MOCK_DATA_KEY = 'xs_admin_mock_data';
  const CONFIG = window.ADMIN_CONFIG || {};
  const USE_MOCK = !!CONFIG.useMock;
  const API_BASE_URL = (CONFIG.apiBaseUrl ? String(CONFIG.apiBaseUrl) : '').replace(/\/$/, '');
  const EXAMPLE_EXAM_FORM = {
    title: '安全生产月示范试卷',
    description: '适合培训完成后的统一摸底测试。',
    coverUrl: 'https://dummyimage.com/600x240/1d4ed8/ffffff&text=Safety+Exam',
    requiresBind: false,
    durationMinutes: 25,
    sortOrder: '',
    active: true
  };

  const state = {
    token: localStorage.getItem(STORAGE_KEY) || '',
    papers: [],
    users: [],
    userExamRecords: [],
    selectedExamRecordDetail: null,
    selectedUserId: null,
    videos: [],
    videoCategories: [],
    currentTab: 'import',
    editingVideoId: null,
    mockImportQuestions: [],
    selectedExamFileName: ''
  };

  const els = {
    loginCard: document.getElementById('loginCard'),
    userCard: document.getElementById('userCard'),
    dashboard: document.getElementById('dashboard'),
    statusBar: document.getElementById('statusBar'),
    adminIdentity: document.getElementById('adminIdentity'),
    loginForm: document.getElementById('loginForm'),
    logoutBtn: document.getElementById('logoutBtn'),
    paperTitle: document.getElementById('paperTitle'),
    paperDescription: document.getElementById('paperDescription'),
    paperCoverUrl: document.getElementById('paperCoverUrl'),
    paperDurationMinutes: document.getElementById('paperDurationMinutes'),
    paperSortOrder: document.getElementById('paperSortOrder'),
    paperRequiresBind: document.getElementById('paperRequiresBind'),
    paperActive: document.getElementById('paperActive'),
    excelFileInput: document.getElementById('excelFileInput'),
    excelFileMeta: document.getElementById('excelFileMeta'),
    importBtn: document.getElementById('importBtn'),
    importMessage: document.getElementById('importMessage'),
    loadExampleBtn: document.getElementById('loadExampleBtn'),
    resetImportBtn: document.getElementById('resetImportBtn'),
    refreshPapersBtn: document.getElementById('refreshPapersBtn'),
    refreshUsersBtn: document.getElementById('refreshUsersBtn'),
    refreshVideosBtn: document.getElementById('refreshVideosBtn'),
    paperTableBody: document.getElementById('paperTableBody'),
    userTableBody: document.getElementById('userTableBody'),
    videoTableBody: document.getElementById('videoTableBody'),
    userKeyword: document.getElementById('userKeyword'),
    userDetailPanel: document.getElementById('userDetailPanel'),
    selectedUserHint: document.getElementById('selectedUserHint'),
    userEditName: document.getElementById('userEditName'),
    userEditIdCard: document.getElementById('userEditIdCard'),
    userEditPosition: document.getElementById('userEditPosition'),
    userEditCompany: document.getElementById('userEditCompany'),
    userEditPhone: document.getElementById('userEditPhone'),
    saveUserBtn: document.getElementById('saveUserBtn'),
    reloadExamRecordsBtn: document.getElementById('reloadExamRecordsBtn'),
    userMessage: document.getElementById('userMessage'),
    userExamEmpty: document.getElementById('userExamEmpty'),
    userExamTableBody: document.getElementById('userExamTableBody'),
    examRecordDetailPanel: document.getElementById('examRecordDetailPanel'),
    examRecordSummary: document.getElementById('examRecordSummary'),
    examRecordStats: document.getElementById('examRecordStats'),
    userExamAnswerBody: document.getElementById('userExamAnswerBody'),
    paperCount: document.getElementById('paperCount'),
    codeUserCount: document.getElementById('codeUserCount'),
    boundUserCount: document.getElementById('boundUserCount'),
    videoCount: document.getElementById('videoCount'),
    videoTitle: document.getElementById('videoTitle'),
    videoCategoryId: document.getElementById('videoCategoryId'),
    videoTag: document.getElementById('videoTag'),
    videoDuration: document.getElementById('videoDuration'),
    videoRequiresBind: document.getElementById('videoRequiresBind'),
    videoActive: document.getElementById('videoActive'),
    videoCoverUrl: document.getElementById('videoCoverUrl'),
    videoUrl: document.getElementById('videoUrl'),
    saveVideoBtn: document.getElementById('saveVideoBtn'),
    resetVideoBtn: document.getElementById('resetVideoBtn'),
    videoMessage: document.getElementById('videoMessage')
  };

  function createDemoExamQuestions() {
    return [
      {
        questionText: '统一响应结构中最推荐保留的三个核心字段是什么？',
        optionA: 'success、payload、error',
        optionB: 'code、message、data',
        optionC: 'status、msg、body',
        optionD: 'httpCode、detail、content',
        correctAnswer: 'B',
        imageUrl: '',
        sortOrder: 1
      },
      {
        questionText: '微信小程序登录后最常见需要保存的凭证是什么？',
        optionA: 'token',
        optionB: 'Excel 文件',
        optionC: '图片水印',
        optionD: '分享海报',
        correctAnswer: 'A',
        imageUrl: '',
        sortOrder: 2
      },
      {
        questionText: '如果某题答案为 D，则最少需要准备几个选项？',
        optionA: '1 个',
        optionB: '2 个',
        optionC: '3 个',
        optionD: '4 个',
        correctAnswer: 'D',
        imageUrl: 'https://dummyimage.com/600x320/e0f2fe/1e3a8a&text=Exam+Question',
        sortOrder: 3
      }
    ];
  }

  function createDefaultMockData() {
    return {
      papers: [
        {
          id: 1,
          title: '新员工入门试卷',
          description: '用于演示导入后列表展示效果。',
          durationMinutes: 20,
          requiresBind: false,
          active: true,
          questionCount: 2,
          sortOrder: 1,
          createdAt: '2026-03-27 09:20:00'
        },
        {
          id: 2,
          title: '会员进阶试卷',
          description: '用于演示需要绑定账号的试卷。',
          durationMinutes: 30,
          requiresBind: true,
          active: true,
          questionCount: 3,
          sortOrder: 2,
          createdAt: '2026-03-27 09:35:00'
        },
        {
          id: 3,
          title: '月度复训抽测试卷',
          description: '适合月度知识回顾与班组抽测。',
          durationMinutes: 15,
          requiresBind: false,
          active: true,
          questionCount: 5,
          sortOrder: 3,
          createdAt: '2026-03-27 09:50:00'
        },
        {
          id: 4,
          title: '岗位责任考试卷',
          description: '演示岗位职责与现场规范的考核卷。',
          durationMinutes: 35,
          requiresBind: true,
          active: false,
          questionCount: 8,
          sortOrder: 4,
          createdAt: '2026-03-27 10:05:00'
        }
      ],
      videoCategories: [
        {
          id: 1,
          name: '常见问题',
          sortOrder: 1
        },
        {
          id: 2,
          name: '进阶学习',
          sortOrder: 2
        }
      ],
      videos: [
        {
          id: 1,
          categoryId: 1,
          categoryName: '常见问题',
          title: '小程序常见登录问题排查',
          coverUrl: 'https://dummyimage.com/600x340/0f766e/ffffff&text=Login+Guide',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          tag: '登录,jwt,鉴权,openid',
          duration: 420,
          requiresBind: false,
          active: true,
          createdAt: '2026-03-27 10:00:00'
        },
        {
          id: 2,
          categoryId: 2,
          categoryName: '进阶学习',
          title: '会员进阶试卷讲解',
          coverUrl: 'https://dummyimage.com/600x340/1d4ed8/ffffff&text=Advanced+Guide',
          videoUrl: 'https://www.w3schools.com/html/movie.mp4',
          tag: '会员,绑定,试卷,进阶',
          duration: 680,
          requiresBind: true,
          active: true,
          createdAt: '2026-03-27 10:12:00'
        }
      ],
      users: [
        {
          userId: 1,
          name: '张三',
          idCard: '330102199001011234',
          position: '安全员',
          company: '小山科技',
          phone: '13800138000',
          openid: 'mock_openid_demo',
          memberStatus: 'BOUND',
          activationCode: 'XS-DEMO001',
          updatedAt: '2026-03-27 09:40:00'
        },
        {
          userId: 2,
          name: '李四',
          idCard: '330102199505055678',
          position: '培训专员',
          company: '演示企业',
          phone: '13900139000',
          openid: 'mock_openid_guest',
          memberStatus: 'NEED_BIND',
          activationCode: 'XS-DEMO002',
          updatedAt: '2026-03-27 09:55:00'
        },
        {
          userId: 3,
          name: '王五',
          idCard: '330102198812128888',
          position: '班组长',
          company: '',
          phone: '',
          openid: 'mock_openid_new',
          memberStatus: 'NEED_BIND',
          activationCode: '',
          updatedAt: '2026-03-27 10:05:00'
        }
      ],
      examRecords: {
        1: [
          {
            recordId: 101,
            userId: 1,
            userName: '张三',
            paperId: 1,
            paperTitle: '新员工入门试卷',
            score: 100,
            correctCount: 2,
            total: 2,
            usedSeconds: 740,
            submitTime: '2026-03-27 10:16:00',
            questions: [
              {
                questionId: 101,
                questionText: '统一响应结构中最推荐保留的三个核心字段是什么？',
                optionA: 'success、payload、error',
                optionB: 'code、message、data',
                optionC: 'status、msg、body',
                optionD: 'httpCode、detail、content',
                imageUrl: '',
                userAnswer: 'B',
                correctAnswer: 'B',
                correct: true
              },
              {
                questionId: 102,
                questionText: '微信小程序登录后最常见需要保存的凭证是什么？',
                optionA: 'token',
                optionB: 'Excel 文件',
                optionC: '图片水印',
                optionD: '分享海报',
                imageUrl: '',
                userAnswer: 'A',
                correctAnswer: 'A',
                correct: true
              }
            ]
          },
          {
            recordId: 102,
            userId: 1,
            userName: '张三',
            paperId: 2,
            paperTitle: '会员进阶试卷',
            score: 50,
            correctCount: 1,
            total: 2,
            usedSeconds: 1280,
            submitTime: '2026-03-28 09:35:00',
            questions: [
              {
                questionId: 201,
                questionText: '解绑账号后，下列哪项描述是正确的？',
                optionA: 'company 保持不变',
                optionB: 'JWT 继续长期有效',
                optionC: 'member_status 变成 BOUND',
                optionD: 'phone 和 company 被清空',
                imageUrl: '',
                userAnswer: 'D',
                correctAnswer: 'D',
                correct: true
              },
              {
                questionId: 202,
                questionText: '考试模块升级为多试卷后，提交答案时最合理的额外字段是什么？',
                optionA: 'paperId',
                optionB: 'videoId',
                optionC: 'companyId',
                optionD: 'msgId',
                imageUrl: '',
                userAnswer: 'D',
                correctAnswer: 'A',
                correct: false
              }
            ]
          }
        ],
        2: [
          {
            recordId: 201,
            userId: 2,
            userName: '李四',
            paperId: 3,
            paperTitle: '月度复训抽测试卷',
            score: 80,
            correctCount: 4,
            total: 5,
            usedSeconds: 620,
            submitTime: '2026-03-29 15:12:00',
            questions: [
              {
                questionId: 301,
                questionText: '演示题 1',
                optionA: 'A 选项',
                optionB: 'B 选项',
                optionC: 'C 选项',
                optionD: 'D 选项',
                imageUrl: '',
                userAnswer: 'A',
                correctAnswer: 'A',
                correct: true
              }
            ]
          }
        ]
      }
    };
  }

  function getMockData() {
    const raw = localStorage.getItem(MOCK_DATA_KEY);
    if (!raw) {
      const defaults = createDefaultMockData();
      localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      const defaults = createDefaultMockData();
      localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(defaults));
      return defaults;
    }
  }

  function setMockData(data) {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data || createDefaultMockData()));
  }

  function createMockToken() {
    return 'mock-admin-token';
  }

  function nowText() {
    const date = new Date();
    return date.getFullYear()
      + '-' + padZero(date.getMonth() + 1)
      + '-' + padZero(date.getDate())
      + ' ' + padZero(date.getHours())
      + ':' + padZero(date.getMinutes())
      + ':' + padZero(date.getSeconds());
  }

  function padZero(value) {
    return value < 10 ? '0' + value : '' + value;
  }

  function randomActivationCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'XS-';
    for (let i = 0; i < 8; i += 1) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function setToken(token) {
    state.token = token || '';
    if (state.token) {
      localStorage.setItem(STORAGE_KEY, state.token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function setStatus(text) {
    els.statusBar.textContent = text;
  }

  function setImportMessage(text, type) {
    els.importMessage.textContent = text || '';
    els.importMessage.className = 'inline-message' + (type ? ' ' + type : '');
  }

  function setVideoMessage(text, type) {
    els.videoMessage.textContent = text || '';
    els.videoMessage.className = 'inline-message' + (type ? ' ' + type : '');
  }

  function setUserMessage(text, type) {
    els.userMessage.textContent = text || '';
    els.userMessage.className = 'inline-message' + (type ? ' ' + type : '');
  }

  function updateExcelFileMeta(text) {
    els.excelFileMeta.textContent = text;
  }

  function buildApiUrl(path) {
    if (!API_BASE_URL) {
      return path;
    }
    if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0) {
      return path;
    }
    return API_BASE_URL + path;
  }

  function getCategoryName(categoryId, categories) {
    const current = (categories || []).find(function (item) {
      return Number(item.id) === Number(categoryId);
    });
    return current ? current.name : '';
  }

  function buildMockVideoItem(data, categories, videoId, createdAt) {
    return {
      id: videoId,
      categoryId: Number(data.categoryId),
      categoryName: getCategoryName(data.categoryId, categories),
      title: data.title || '',
      coverUrl: data.coverUrl || '',
      videoUrl: data.videoUrl || '',
      tag: data.tag || '',
      duration: Number(data.duration || 0),
      requiresBind: !!data.requiresBind,
      active: data.active !== false,
      createdAt: createdAt || nowText()
    };
  }

  function formatUsedSeconds(seconds) {
    const total = Math.max(0, Number(seconds || 0));
    const minute = Math.floor(total / 60);
    const second = total % 60;
    if (minute > 0) {
      return minute + '分' + (second < 10 ? '0' + second : second) + '秒';
    }
    return total + '秒';
  }

  function getMockExamRecordsByUser(dataStore, userId) {
    const examRecords = dataStore.examRecords || {};
    return examRecords[String(userId)] || examRecords[userId] || [];
  }

  function buildMockExamRecordSummary(record) {
    return {
      recordId: record.recordId,
      paperId: record.paperId,
      paperTitle: record.paperTitle,
      score: record.score,
      correctCount: record.correctCount,
      total: record.total,
      usedSeconds: record.usedSeconds,
      submitTime: record.submitTime
    };
  }

  function getSelectedUser() {
    return state.users.find(function (item) {
      return Number(item.userId) === Number(state.selectedUserId);
    }) || null;
  }

  function mockRequest(url, options) {
    const finalOptions = Object.assign({
      method: 'GET',
      headers: {}
    }, options || {});
    const method = String(finalOptions.method || 'GET').toUpperCase();
    const data = finalOptions.body ? JSON.parse(finalOptions.body) : {};
    const authHeader = finalOptions.headers.Authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const dataStore = getMockData();

    function requireLogin() {
      if (!token || token !== createMockToken()) {
        throw {
          code: 401,
          message: '管理员登录已失效'
        };
      }
    }

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (url === '/api/admin/login' && method === 'POST') {
            if (data.username !== 'admin' || data.password !== 'ad123') {
              throw {
                code: 401,
                message: '管理员账号或密码错误'
              };
            }
            resolve({
              token: createMockToken(),
              username: 'admin',
              displayName: '管理员'
            });
            return;
          }

          if (url === '/api/admin/logout' && method === 'POST') {
            resolve(null);
            return;
          }

          requireLogin();

          if (url === '/api/admin/exams' && method === 'GET') {
            resolve(dataStore.papers || []);
            return;
          }

          if (url === '/api/admin/exams/import' && method === 'POST') {
            const nextPaperId = (dataStore.papers || []).reduce(function (maxId, item) {
              return Math.max(maxId, Number(item.id || 0));
            }, 0) + 1;
            const questions = Array.isArray(data.questions) ? data.questions : [];
            const nextPaper = {
              id: nextPaperId,
              title: data.title || '未命名试卷',
              description: data.description || '',
              durationMinutes: Number(data.durationMinutes || 30),
              requiresBind: !!data.requiresBind,
              active: data.active !== false,
              questionCount: questions.length,
              sortOrder: Number(data.sortOrder || nextPaperId),
              createdAt: nowText()
            };
            dataStore.papers.unshift(nextPaper);
            setMockData(dataStore);
            resolve({
              paperId: nextPaperId,
              title: nextPaper.title,
              questionCount: nextPaper.questionCount
            });
            return;
          }

          if (url === '/api/admin/videos/categories' && method === 'GET') {
            resolve(dataStore.videoCategories || []);
            return;
          }

          if (url === '/api/admin/videos' && method === 'GET') {
            resolve(dataStore.videos || []);
            return;
          }

          if (url === '/api/admin/videos' && method === 'POST') {
            const nextVideoId = (dataStore.videos || []).reduce(function (maxId, item) {
              return Math.max(maxId, Number(item.id || 0));
            }, 0) + 1;
            const nextVideo = buildMockVideoItem(data, dataStore.videoCategories, nextVideoId, nowText());
            dataStore.videos.unshift(nextVideo);
            setMockData(dataStore);
            resolve(nextVideo);
            return;
          }

          const videoMatch = url.match(/^\/api\/admin\/videos\/(\d+)$/);
          if (videoMatch && method === 'PUT') {
            const videoId = Number(videoMatch[1]);
            let updatedVideo = null;
            dataStore.videos = (dataStore.videos || []).map(function (item) {
              if (Number(item.id) !== videoId) {
                return item;
              }
              updatedVideo = buildMockVideoItem(data, dataStore.videoCategories, videoId, item.createdAt);
              return updatedVideo;
            });
            if (!updatedVideo) {
              throw {
                code: 400,
                message: '视频不存在'
              };
            }
            setMockData(dataStore);
            resolve(updatedVideo);
            return;
          }

          if (videoMatch && method === 'DELETE') {
            const videoId = Number(videoMatch[1]);
            const hasVideo = (dataStore.videos || []).some(function (item) {
              return Number(item.id) === videoId;
            });
            if (!hasVideo) {
              throw {
                code: 400,
                message: '视频不存在'
              };
            }
            dataStore.videos = (dataStore.videos || []).filter(function (item) {
              return Number(item.id) !== videoId;
            });
            setMockData(dataStore);
            resolve(null);
            return;
          }

          if (url === '/api/admin/users' && method === 'GET') {
            resolve(dataStore.users || []);
            return;
          }

          const userUpdateMatch = url.match(/^\/api\/admin\/users\/(\d+)$/);
          if (userUpdateMatch && method === 'PUT') {
            const userId = Number(userUpdateMatch[1]);
            let updatedUser = null;
            dataStore.users = (dataStore.users || []).map(function (item) {
              if (Number(item.userId) !== userId) {
                return item;
              }
              updatedUser = Object.assign({}, item, {
                name: data.name || '',
                idCard: data.idCard || '',
                position: data.position || '',
                company: data.company || '',
                phone: data.phone || '',
                updatedAt: nowText()
              });
              return updatedUser;
            });
            if (!updatedUser) {
              throw {
                code: 400,
                message: '用户不存在'
              };
            }
            setMockData(dataStore);
            resolve(updatedUser);
            return;
          }

          const userMatch = url.match(/^\/api\/admin\/users\/(\d+)\/activation-code$/);
          if (userMatch && method === 'POST') {
            const userId = Number(userMatch[1]);
            let updatedUser = null;
            dataStore.users = (dataStore.users || []).map(function (item) {
              if (Number(item.userId) !== userId) {
                return item;
              }
              updatedUser = Object.assign({}, item, {
                activationCode: randomActivationCode(),
                updatedAt: nowText()
              });
              return updatedUser;
            });
            if (!updatedUser) {
              throw {
                code: 400,
                message: '用户不存在'
              };
            }
            setMockData(dataStore);
            resolve(updatedUser);
            return;
          }

          const userExamMatch = url.match(/^\/api\/admin\/users\/(\d+)\/exam-records$/);
          if (userExamMatch && method === 'GET') {
            const userId = Number(userExamMatch[1]);
            resolve(getMockExamRecordsByUser(dataStore, userId).map(buildMockExamRecordSummary));
            return;
          }

          const recordDetailMatch = url.match(/^\/api\/admin\/users\/exam-records\/(\d+)$/);
          if (recordDetailMatch && method === 'GET') {
            const recordId = Number(recordDetailMatch[1]);
            const record = Object.keys(dataStore.examRecords || {}).reduce(function (found, userId) {
              if (found) {
                return found;
              }
              return getMockExamRecordsByUser(dataStore, userId).find(function (item) {
                return Number(item.recordId) === recordId;
              }) || null;
            }, null);
            if (!record) {
              throw {
                code: 400,
                message: '考试记录不存在'
              };
            }
            resolve(record);
            return;
          }

          throw {
            code: 404,
            message: '未找到 mock 接口'
          };
        } catch (error) {
          reject(error);
        }
      }, 260);
    });
  }

  function fetchJson(url, options) {
    const finalOptions = Object.assign({
      method: 'GET',
      headers: {}
    }, options || {});
    if (!(finalOptions.body instanceof FormData)) {
      finalOptions.headers['Content-Type'] = 'application/json';
    }
    if (state.token) {
      finalOptions.headers.Authorization = 'Bearer ' + state.token;
    }

    if (USE_MOCK) {
      return mockRequest(url, finalOptions);
    }

    return fetch(buildApiUrl(url), finalOptions)
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        if (payload.code !== 0) {
          throw payload;
        }
        return payload.data;
      });
  }

  function uploadExamByExcel(payload, file) {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description || '');
    formData.append('coverUrl', payload.coverUrl || '');
    formData.append('requiresBind', String(payload.requiresBind));
    formData.append('durationMinutes', String(payload.durationMinutes));
    if (payload.sortOrder !== '') {
      formData.append('sortOrder', String(payload.sortOrder));
    }
    formData.append('active', String(payload.active));
    formData.append('file', file);
    return fetchJson('/api/admin/exams/import-excel', {
      method: 'POST',
      body: formData
    });
  }

  function renderLoginState(loggedIn, displayName) {
    els.loginCard.classList.toggle('hidden', loggedIn);
    els.userCard.classList.toggle('hidden', !loggedIn);
    els.dashboard.classList.toggle('hidden', !loggedIn);
    els.adminIdentity.textContent = displayName || '管理员';
    setStatus(loggedIn ? (USE_MOCK ? 'Mock 演示中' : '已登录') : '未登录');
  }

  function renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(function (button) {
      button.classList.toggle('active', button.dataset.tab === state.currentTab);
    });
    document.querySelectorAll('.tab-panel').forEach(function (panel) {
      panel.classList.toggle('hidden', panel.dataset.panel !== state.currentTab);
    });
  }

  function renderPapers() {
    els.paperCount.textContent = String(state.papers.length);
    els.paperTableBody.innerHTML = state.papers.map(function (paper) {
      return '<tr>'
        + '<td>' + paper.id + '</td>'
        + '<td><strong>' + escapeHtml(paper.title) + '</strong><br><span class="card-tip">' + escapeHtml(paper.description || '-') + '</span></td>'
        + '<td>' + paper.questionCount + '</td>'
        + '<td>' + paper.durationMinutes + ' 分钟</td>'
        + '<td>' + (paper.requiresBind ? '是' : '否') + '</td>'
        + '<td>' + (paper.active ? '启用' : '停用') + '</td>'
        + '<td>' + (paper.sortOrder == null ? '-' : paper.sortOrder) + '</td>'
        + '<td>' + escapeHtml(paper.createdAt || '-') + '</td>'
        + '</tr>';
    }).join('');
  }

  function renderUsers() {
    const keyword = (els.userKeyword.value || '').trim().toLowerCase();
    const filteredUsers = state.users.filter(function (user) {
      if (!keyword) {
        return true;
      }
      return String(user.company || '').toLowerCase().indexOf(keyword) > -1
        || String(user.name || '').toLowerCase().indexOf(keyword) > -1
        || String(user.idCard || '').toLowerCase().indexOf(keyword) > -1
        || String(user.position || '').toLowerCase().indexOf(keyword) > -1
        || String(user.phone || '').toLowerCase().indexOf(keyword) > -1
        || String(user.openid || '').toLowerCase().indexOf(keyword) > -1;
    });
    const codeUserCount = state.users.filter(function (user) {
      return !!user.activationCode;
    }).length;
    const boundUserCount = state.users.filter(function (user) {
      return user.memberStatus === 'BOUND';
    }).length;
    els.codeUserCount.textContent = String(codeUserCount);
    els.boundUserCount.textContent = String(boundUserCount);
    els.userTableBody.innerHTML = filteredUsers.map(function (user) {
      const statusClass = user.memberStatus === 'BOUND' ? 'tag-bound' : 'tag-pending';
      const selectedClass = Number(state.selectedUserId) === Number(user.userId) ? ' class="selected-row"' : '';
      return '<tr' + selectedClass + '>'
        + '<td>' + user.userId + '</td>'
        + '<td>' + escapeHtml(user.name || '-') + '</td>'
        + '<td>' + escapeHtml(user.idCard || '-') + '</td>'
        + '<td>' + escapeHtml(user.position || '-') + '</td>'
        + '<td>' + escapeHtml(user.company || '-') + '</td>'
        + '<td>' + escapeHtml(user.phone || '-') + '</td>'
        + '<td>' + escapeHtml(user.openid || '-') + '</td>'
        + '<td><span class="table-tag ' + statusClass + '">' + escapeHtml(user.memberStatus || '-') + '</span></td>'
        + '<td>' + escapeHtml(user.activationCode || '未生成') + '</td>'
        + '<td>' + escapeHtml(user.updatedAt || '-') + '</td>'
        + '<td>'
        + '<button type="button" class="row-btn" data-action="select-user" data-user-id="' + user.userId + '">查看详情</button>'
        + '<button type="button" class="row-btn" data-action="refresh-code" data-user-id="' + user.userId + '">生成/刷新激活码</button>'
        + '</td>'
        + '</tr>';
    }).join('');
  }

  function fillUserForm(user) {
    els.userEditName.value = user && user.name ? user.name : '';
    els.userEditIdCard.value = user && user.idCard ? user.idCard : '';
    els.userEditPosition.value = user && user.position ? user.position : '';
    els.userEditCompany.value = user && user.company ? user.company : '';
    els.userEditPhone.value = user && user.phone ? user.phone : '';
  }

  function renderUserDetail() {
    const user = getSelectedUser();
    const hasUser = !!user;
    els.userDetailPanel.classList.toggle('hidden', !hasUser);
    if (!hasUser) {
      return;
    }
    els.selectedUserHint.textContent = '当前用户：' + (user.name || '未命名用户') + ' / openid：' + (user.openid || '-');
    fillUserForm(user);
    renderUserExamRecords();
    renderExamRecordDetail();
  }

  function renderUserExamRecords() {
    const records = state.userExamRecords || [];
    els.userExamEmpty.classList.toggle('hidden', records.length > 0);
    if (!records.length) {
      els.userExamTableBody.innerHTML = '';
      return;
    }
    els.userExamTableBody.innerHTML = records.map(function (record) {
      return '<tr>'
        + '<td>' + record.recordId + '</td>'
        + '<td><strong>' + escapeHtml(record.paperTitle || '-') + '</strong></td>'
        + '<td>' + Number(record.score || 0) + ' 分</td>'
        + '<td>' + Number(record.correctCount || 0) + ' / ' + Number(record.total || 0) + '</td>'
        + '<td>' + escapeHtml(formatUsedSeconds(record.usedSeconds)) + '</td>'
        + '<td>' + escapeHtml(record.submitTime || '-') + '</td>'
        + '<td><button type="button" class="row-btn" data-record-id="' + record.recordId + '">查看答题详情</button></td>'
        + '</tr>';
    }).join('');
  }

  function renderExamRecordDetail() {
    const detail = state.selectedExamRecordDetail;
    els.examRecordDetailPanel.classList.toggle('hidden', !detail);
    if (!detail) {
      els.examRecordSummary.textContent = '请选择一条考试记录查看每题答案。';
      els.examRecordStats.innerHTML = '';
      els.userExamAnswerBody.innerHTML = '';
      return;
    }
    els.examRecordSummary.textContent = (detail.userName || '该用户') + ' 于 ' + (detail.submitTime || '-')
      + ' 提交《' + (detail.paperTitle || '-') + '》';
    els.examRecordStats.innerHTML = [
      { label: '分数', value: (detail.score || 0) + ' 分' },
      { label: '正确题数', value: (detail.correctCount || 0) + ' / ' + (detail.total || 0) },
      { label: '用时', value: formatUsedSeconds(detail.usedSeconds) },
      { label: '记录 ID', value: detail.recordId || '-' }
    ].map(function (item) {
      return '<div class="mini-stat"><div class="mini-stat-label">' + escapeHtml(item.label)
        + '</div><div class="mini-stat-value">' + escapeHtml(item.value) + '</div></div>';
    }).join('');
    els.userExamAnswerBody.innerHTML = (detail.questions || []).map(function (question, index) {
      const resultText = question.correct ? '正确' : '错误';
      const resultClass = question.correct ? 'tag-bound' : 'tag-pending';
      const optionList = ['A', 'B', 'C', 'D'].map(function (key) {
        const optionText = question['option' + key];
        if (!optionText) {
          return '';
        }
        return '<div>' + key + '．' + escapeHtml(optionText) + '</div>';
      }).join('');
      return '<tr>'
        + '<td>' + (index + 1) + '</td>'
        + '<td><strong>' + escapeHtml(question.questionText || '-') + '</strong>'
        + (question.imageUrl ? '<br><span class="card-tip">' + escapeHtml(question.imageUrl) + '</span>' : '')
        + '</td>'
        + '<td>' + optionList + '</td>'
        + '<td>' + escapeHtml(question.userAnswer || '未作答') + '</td>'
        + '<td>' + escapeHtml(question.correctAnswer || '-') + '</td>'
        + '<td><span class="table-tag ' + resultClass + '">' + resultText + '</span></td>'
        + '</tr>';
    }).join('');
  }

  function selectUser(userId) {
    state.selectedUserId = Number(userId || 0) || null;
    state.selectedExamRecordDetail = null;
    state.userExamRecords = [];
    setUserMessage('', '');
    renderUsers();
    renderUserDetail();
    if (state.selectedUserId) {
      loadUserExamRecords(state.selectedUserId);
    }
  }

  function readUserPayload() {
    return {
      name: els.userEditName.value.trim(),
      idCard: els.userEditIdCard.value.trim(),
      position: els.userEditPosition.value.trim(),
      company: els.userEditCompany.value.trim(),
      phone: els.userEditPhone.value.trim()
    };
  }

  function loadUserExamRecords(userId, preferredRecordId) {
    if (!userId) {
      return Promise.resolve([]);
    }
    return fetchJson('/api/admin/users/' + userId + '/exam-records').then(function (records) {
      state.userExamRecords = records || [];
      renderUserDetail();
      if (state.userExamRecords.length) {
        return loadExamRecordDetail(preferredRecordId || state.userExamRecords[0].recordId);
      }
      state.selectedExamRecordDetail = null;
      renderExamRecordDetail();
      return [];
    }).catch(function (error) {
      state.userExamRecords = [];
      state.selectedExamRecordDetail = null;
      renderUserDetail();
      setUserMessage(error.message || '加载考试记录失败', 'error');
      return [];
    });
  }

  function loadExamRecordDetail(recordId) {
    if (!recordId) {
      return Promise.resolve(null);
    }
    return fetchJson('/api/admin/users/exam-records/' + recordId).then(function (detail) {
      state.selectedExamRecordDetail = detail || null;
      renderExamRecordDetail();
      return detail;
    }).catch(function (error) {
      state.selectedExamRecordDetail = null;
      renderExamRecordDetail();
      setUserMessage(error.message || '加载答题详情失败', 'error');
      return null;
    });
  }

  function handleSaveUser() {
    const selectedUser = getSelectedUser();
    if (!selectedUser) {
      setUserMessage('请先选择用户。', 'error');
      return;
    }
    setUserMessage('正在保存用户资料...', '');
    fetchJson('/api/admin/users/' + selectedUser.userId, {
      method: 'PUT',
      body: JSON.stringify(readUserPayload())
    }).then(function (updatedUser) {
      state.users = state.users.map(function (item) {
        return Number(item.userId) === Number(updatedUser.userId) ? updatedUser : item;
      });
      renderUsers();
      renderUserDetail();
      setUserMessage('用户资料已更新。', 'success');
    }).catch(function (error) {
      setUserMessage(error.message || '保存用户资料失败', 'error');
    });
  }

  function renderVideoCategoryOptions() {
    if (!els.videoCategoryId) {
      return;
    }
    els.videoCategoryId.innerHTML = state.videoCategories.map(function (category) {
      return '<option value="' + category.id + '">' + escapeHtml(category.name) + '</option>';
    }).join('');
    if (!state.editingVideoId && state.videoCategories.length > 0) {
      els.videoCategoryId.value = String(state.videoCategories[0].id);
    }
  }

  function renderVideos() {
    els.videoCount.textContent = String(state.videos.length);
    if (!state.videos.length) {
      els.videoTableBody.innerHTML = '<tr><td colspan="9">暂无视频，请先新增一条演示视频。</td></tr>';
      return;
    }
    els.videoTableBody.innerHTML = state.videos.map(function (video) {
      return '<tr>'
        + '<td>' + video.id + '</td>'
        + '<td><strong>' + escapeHtml(video.title) + '</strong><br><span class="card-tip">' + escapeHtml(video.videoUrl || '-') + '</span></td>'
        + '<td>' + escapeHtml(video.categoryName || '-') + '</td>'
        + '<td>' + escapeHtml(video.tag || '-') + '</td>'
        + '<td>' + Number(video.duration || 0) + ' 秒</td>'
        + '<td>' + (video.requiresBind ? '是' : '否') + '</td>'
        + '<td>' + (video.active ? '启用' : '停用') + '</td>'
        + '<td>' + escapeHtml(video.createdAt || '-') + '</td>'
        + '<td>'
        + '<button type="button" class="row-btn" data-action="edit" data-video-id="' + video.id + '">编辑</button>'
        + '<button type="button" class="row-btn row-btn-danger" data-action="delete" data-video-id="' + video.id + '">删除</button>'
        + '</td>'
        + '</tr>';
    }).join('');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadInitialData() {
    return Promise.all([
      fetchJson('/api/admin/exams'),
      fetchJson('/api/admin/users'),
      fetchJson('/api/admin/videos'),
      fetchJson('/api/admin/videos/categories')
    ]).then(function (result) {
      state.papers = result[0] || [];
      state.users = result[1] || [];
      state.videos = result[2] || [];
      state.videoCategories = result[3] || [];
      renderPapers();
      renderUsers();
      renderUserDetail();
      renderVideoCategoryOptions();
      renderVideos();
      resetVideoForm(false);
    });
  }

  function readExamPayload() {
    return {
      title: els.paperTitle.value.trim(),
      description: els.paperDescription.value.trim(),
      coverUrl: els.paperCoverUrl.value.trim(),
      durationMinutes: Number(els.paperDurationMinutes.value || 30),
      sortOrder: els.paperSortOrder.value.trim(),
      requiresBind: els.paperRequiresBind.value === 'true',
      active: els.paperActive.value !== 'false'
    };
  }

  function resetImportForm(clearMessage) {
    els.paperTitle.value = '';
    els.paperDescription.value = '';
    els.paperCoverUrl.value = '';
    els.paperDurationMinutes.value = '30';
    els.paperSortOrder.value = '';
    els.paperRequiresBind.value = 'false';
    els.paperActive.value = 'true';
    if (els.excelFileInput) {
      els.excelFileInput.value = '';
    }
    state.mockImportQuestions = [];
    state.selectedExamFileName = '';
    updateExcelFileMeta('未选择 Excel 文件。支持列名：题目、选项A、选项B、选项C、选项D、答案、图片地址、排序。');
    if (clearMessage !== false) {
      setImportMessage('', '');
    }
  }

  function fillImportDemo() {
    els.paperTitle.value = EXAMPLE_EXAM_FORM.title;
    els.paperDescription.value = EXAMPLE_EXAM_FORM.description;
    els.paperCoverUrl.value = EXAMPLE_EXAM_FORM.coverUrl;
    els.paperDurationMinutes.value = String(EXAMPLE_EXAM_FORM.durationMinutes);
    els.paperSortOrder.value = String(EXAMPLE_EXAM_FORM.sortOrder || '');
    els.paperRequiresBind.value = EXAMPLE_EXAM_FORM.requiresBind ? 'true' : 'false';
    els.paperActive.value = EXAMPLE_EXAM_FORM.active ? 'true' : 'false';
    state.mockImportQuestions = createDemoExamQuestions();
    updateExcelFileMeta('已加载演示题目，共 ' + state.mockImportQuestions.length + ' 题。联调后端时请选择真实 Excel 文件继续导入。');
    setImportMessage('演示题目已就绪。', 'success');
  }

  function handleExcelFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      state.selectedExamFileName = '';
      updateExcelFileMeta('未选择 Excel 文件。支持列名：题目、选项A、选项B、选项C、选项D、答案、图片地址、排序。');
      return;
    }
    state.selectedExamFileName = file.name || '';
    updateExcelFileMeta('已选择 Excel：' + state.selectedExamFileName + '。导入时会由后端解析题目内容。');
    setImportMessage('', '');
  }

  function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    fetchJson('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(function (result) {
      setToken(result.token);
      renderLoginState(true, result.displayName || result.username);
      return loadInitialData();
    }).catch(function (error) {
      alert(error.message || '登录失败');
      renderLoginState(false);
    });
  }

  function handleLogout() {
    fetchJson('/api/admin/logout', {
      method: 'POST'
    }).finally(function () {
      setToken('');
      renderLoginState(false);
    });
  }

  function handleImport() {
    const payload = readExamPayload();
    if (!payload.title) {
      setImportMessage('请先填写试卷名称。', 'error');
      return;
    }
    if (!payload.durationMinutes || payload.durationMinutes <= 0) {
      setImportMessage('考试时长必须大于 0 分钟。', 'error');
      return;
    }

    if (USE_MOCK) {
      const questions = state.mockImportQuestions.length ? state.mockImportQuestions.slice() : createDemoExamQuestions();
      setImportMessage('Mock 模式正在导入演示题目...', '');
      fetchJson('/api/admin/exams/import', {
        method: 'POST',
        body: JSON.stringify(Object.assign({}, payload, {
          sortOrder: payload.sortOrder === '' ? null : Number(payload.sortOrder),
          questions: questions
        }))
      }).then(function (result) {
        setImportMessage('导入成功：' + result.title + '，共 ' + result.questionCount + ' 题。', 'success');
        return fetchJson('/api/admin/exams');
      }).then(function (papers) {
        state.papers = papers || [];
        renderPapers();
        resetImportForm(false);
      }).catch(function (error) {
        setImportMessage(error.message || '导入失败', 'error');
      });
      return;
    }

    const file = els.excelFileInput.files && els.excelFileInput.files[0];
    if (!file) {
      setImportMessage('请选择 Excel 文件后再导入。', 'error');
      return;
    }

    setImportMessage('正在上传并解析 Excel...', '');
    uploadExamByExcel(payload, file).then(function (result) {
      setImportMessage('导入成功：' + result.title + '，共 ' + result.questionCount + ' 题。', 'success');
      return fetchJson('/api/admin/exams');
    }).then(function (papers) {
      state.papers = papers || [];
      renderPapers();
      resetImportForm(false);
    }).catch(function (error) {
      setImportMessage(error.message || '导入失败', 'error');
    });
  }

  function refreshUsers() {
    return fetchJson('/api/admin/users').then(function (users) {
      state.users = users || [];
      if (state.selectedUserId && !getSelectedUser()) {
        state.selectedUserId = null;
        state.userExamRecords = [];
        state.selectedExamRecordDetail = null;
      }
      renderUsers();
      renderUserDetail();
    }).catch(function (error) {
      alert(error.message || '刷新用户失败');
    });
  }

  function refreshPapers() {
    fetchJson('/api/admin/exams').then(function (papers) {
      state.papers = papers || [];
      renderPapers();
    }).catch(function (error) {
      alert(error.message || '刷新试卷失败');
    });
  }

  function refreshVideos() {
    return Promise.all([
      fetchJson('/api/admin/videos'),
      fetchJson('/api/admin/videos/categories')
    ]).then(function (result) {
      state.videos = result[0] || [];
      state.videoCategories = result[1] || [];
      renderVideoCategoryOptions();
      renderVideos();
      if (!state.editingVideoId) {
        resetVideoForm(false);
      }
    }).catch(function (error) {
      alert(error.message || '刷新视频失败');
    });
  }

  function readVideoPayload() {
    return {
      categoryId: Number(els.videoCategoryId.value || 0),
      title: els.videoTitle.value.trim(),
      coverUrl: els.videoCoverUrl.value.trim(),
      videoUrl: els.videoUrl.value.trim(),
      tag: els.videoTag.value.trim(),
      duration: Number(els.videoDuration.value || 0),
      requiresBind: els.videoRequiresBind.value === 'true',
      active: els.videoActive.value !== 'false'
    };
  }

  function resetVideoForm(clearMessage) {
    state.editingVideoId = null;
    els.videoTitle.value = '';
    els.videoTag.value = '';
    els.videoDuration.value = '';
    els.videoRequiresBind.value = 'false';
    els.videoActive.value = 'true';
    els.videoCoverUrl.value = '';
    els.videoUrl.value = '';
    if (state.videoCategories.length > 0) {
      els.videoCategoryId.value = String(state.videoCategories[0].id);
    }
    els.saveVideoBtn.textContent = '保存视频';
    if (clearMessage !== false) {
      setVideoMessage('', '');
    }
  }

  function fillVideoForm(video) {
    state.editingVideoId = video.id;
    els.videoTitle.value = video.title || '';
    els.videoCategoryId.value = String(video.categoryId || '');
    els.videoTag.value = video.tag || '';
    els.videoDuration.value = String(video.duration == null ? '' : video.duration);
    els.videoRequiresBind.value = video.requiresBind ? 'true' : 'false';
    els.videoActive.value = video.active ? 'true' : 'false';
    els.videoCoverUrl.value = video.coverUrl || '';
    els.videoUrl.value = video.videoUrl || '';
    els.saveVideoBtn.textContent = '更新视频';
    setVideoMessage('正在编辑视频：' + (video.title || ''), '');
    state.currentTab = 'videos';
    renderTabs();
  }

  function handleSaveVideo() {
    const payload = readVideoPayload();
    if (!payload.categoryId) {
      setVideoMessage('请先选择视频分类。', 'error');
      return;
    }
    if (!payload.title) {
      setVideoMessage('请输入视频标题。', 'error');
      return;
    }
    if (!payload.videoUrl) {
      setVideoMessage('请输入视频地址。', 'error');
      return;
    }

    const isEdit = !!state.editingVideoId;
    setVideoMessage(isEdit ? '正在更新视频...' : '正在保存视频...', '');
    fetchJson(isEdit ? '/api/admin/videos/' + state.editingVideoId : '/api/admin/videos', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    }).then(function () {
      setVideoMessage(isEdit ? '视频更新成功。' : '视频新增成功。', 'success');
      resetVideoForm(false);
      return refreshVideos();
    }).catch(function (error) {
      setVideoMessage(error.message || '保存视频失败', 'error');
    });
  }

  function handleVideoTableClick(event) {
    const target = event.target;
    const action = target.dataset.action;
    const videoId = Number(target.dataset.videoId || 0);
    if (!action || !videoId) {
      return;
    }
    const currentVideo = state.videos.find(function (item) {
      return Number(item.id) === videoId;
    });
    if (!currentVideo) {
      return;
    }
    if (action === 'edit') {
      fillVideoForm(currentVideo);
      return;
    }
    if (action === 'delete') {
      const confirmed = window.confirm('确认删除视频《' + currentVideo.title + '》吗？');
      if (!confirmed) {
        return;
      }
      fetchJson('/api/admin/videos/' + videoId, {
        method: 'DELETE'
      }).then(function () {
        if (state.editingVideoId === videoId) {
          resetVideoForm(false);
        }
        setVideoMessage('视频已删除。', 'success');
        return refreshVideos();
      }).catch(function (error) {
        setVideoMessage(error.message || '删除视频失败', 'error');
      });
    }
  }

  function handleUserTableClick(event) {
    const target = event.target;
    if (!target.classList.contains('row-btn')) {
      return;
    }
    const action = target.dataset.action;
    const userId = Number(target.dataset.userId || 0);
    if (!userId) {
      return;
    }
    if (action === 'select-user') {
      state.currentTab = 'users';
      renderTabs();
      selectUser(userId);
      return;
    }
    fetchJson('/api/admin/users/' + userId + '/activation-code', {
      method: 'POST'
    }).then(function (updatedUser) {
      state.users = state.users.map(function (item) {
        return String(item.userId) === String(updatedUser.userId) ? updatedUser : item;
      });
      renderUsers();
      renderUserDetail();
      setUserMessage('激活码已刷新。', 'success');
    }).catch(function (error) {
      setUserMessage(error.message || '生成激活码失败', 'error');
    });
  }

  function handleUserExamTableClick(event) {
    const target = event.target;
    if (!target.classList.contains('row-btn')) {
      return;
    }
    const recordId = Number(target.dataset.recordId || 0);
    if (!recordId) {
      return;
    }
    loadExamRecordDetail(recordId).then(function () {
      setUserMessage('答题详情已更新。', 'success');
    });
  }

  function bindEvents() {
    els.loginForm.addEventListener('submit', handleLogin);
    els.logoutBtn.addEventListener('click', handleLogout);
    els.importBtn.addEventListener('click', handleImport);
    els.loadExampleBtn.addEventListener('click', fillImportDemo);
    els.resetImportBtn.addEventListener('click', function () {
      resetImportForm();
    });
    els.excelFileInput.addEventListener('change', handleExcelFileChange);
    els.refreshPapersBtn.addEventListener('click', refreshPapers);
    els.refreshUsersBtn.addEventListener('click', refreshUsers);
    els.refreshVideosBtn.addEventListener('click', refreshVideos);
    els.saveVideoBtn.addEventListener('click', handleSaveVideo);
    els.resetVideoBtn.addEventListener('click', function () {
      resetVideoForm();
    });
    els.userKeyword.addEventListener('input', renderUsers);
    els.saveUserBtn.addEventListener('click', handleSaveUser);
    els.reloadExamRecordsBtn.addEventListener('click', function () {
      const selectedUser = getSelectedUser();
      if (!selectedUser) {
        setUserMessage('请先选择用户。', 'error');
        return;
      }
      setUserMessage('正在刷新考试记录...', '');
      loadUserExamRecords(selectedUser.userId).then(function () {
        setUserMessage('考试记录已刷新。', 'success');
      });
    });
    els.userTableBody.addEventListener('click', handleUserTableClick);
    els.userExamTableBody.addEventListener('click', handleUserExamTableClick);
    els.videoTableBody.addEventListener('click', handleVideoTableClick);
    document.querySelectorAll('.tab-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        state.currentTab = button.dataset.tab;
        renderTabs();
      });
    });
  }

  function bootstrap() {
    bindEvents();
    resetImportForm(false);
    setUserMessage('', '');
    renderTabs();
    if (!state.token) {
      renderLoginState(false);
      return;
    }
    renderLoginState(true, '管理员');
    loadInitialData().catch(function () {
      setToken('');
      renderLoginState(false);
      alert(USE_MOCK ? 'Mock 数据初始化失败，请刷新页面重试。' : '管理员会话已失效，请重新登录。');
    });
  }

  bootstrap();
})();
