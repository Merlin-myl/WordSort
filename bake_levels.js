// ============================================================
// bake_levels.js — 离线生成全部30关数据，输出到 baked_levels.json
// ============================================================

const fs = require('fs');
const path = require('path');

// ============================================================
// 一、配置数据
// ============================================================

const WORDS = {
  200001:'中国',200002:'美国',200003:'巴西',200004:'德国',200005:'英格兰',
  200006:'阿根廷',200007:'法国',200008:'荷兰',200009:'足球',200010:'篮球',
  200011:'排球',200012:'乒乓球',200013:'马拉松',200014:'短跑',200015:'跳远',
  200016:'跳高',200017:'汉堡',200018:'寿司',200019:'烤串',200020:'炸鸡',
  200021:'奶茶',200022:'咖啡',200023:'橙汁',200024:'豆浆',200025:'冲锋枪',
  200026:'坦克',200027:'导弹',200028:'战斗机',200029:'出租车',200030:'火车',
  200031:'公交车',200032:'客机',200033:'衬衫',200034:'T恤',200035:'毛衣',
  200036:'夹克',200037:'牛仔裤',200038:'泳裤',200039:'短裙',200040:'马面裙',
  200041:'头巾',200042:'鸭舌帽',200043:'发卡',200044:'假发',200045:'苹果',
  200046:'香蕉',200047:'西瓜',200048:'菠萝',200049:'胡萝卜',200050:'卷心菜',
  200051:'西蓝花',200052:'菠菜',200053:'警察局',200054:'消防队',200055:'法院',
  200056:'监狱',200057:'超市',200058:'酒店',200059:'餐厅',200060:'电影院',
  200061:'手机',200062:'平板电脑',200063:'智能手表',200064:'蓝牙耳机',
  200065:'蜘蛛侠',200066:'蝙蝠侠',200067:'钢铁侠',200068:'超人',200069:'特斯拉',
  200070:'奔驰',200071:'劳斯莱斯',200072:'宾利',200073:'橘猫',200074:'哈士奇',
  200075:'仓鼠',200076:'鹦鹉',200077:'厨师',200078:'医生',200079:'律师',
  200080:'警察',200081:'蛇',200082:'蜥蜴',200083:'鳄鱼',200084:'乌龟',
  200085:'忍者神龟',200086:'奥特曼',200087:'变形金刚',200088:'猫和老鼠',
  200089:'数学',200090:'物理',200091:'化学',200092:'生物',200093:'语文',
  200094:'英语',200095:'历史',200096:'地理',200097:'魔兽世界',200098:'原神',
  200099:'宝可梦',200100:'战神',200101:'策划',200102:'美术',200103:'程序',
  200104:'模型',200105:'北京',200106:'成都',200107:'拉萨',200108:'三亚',
  200109:'纽约',200110:'洛杉矶',200111:'亚特兰大',200112:'堪萨斯',200113:'电视',
  200114:'冰箱',200115:'空调',200116:'洗衣机',200117:'玫瑰',200118:'百合',
  200119:'茉莉',200120:'蝴蝶兰',200121:'威士忌',200122:'白兰地',200123:'干红',
  200124:'百利甜',200125:'钢琴',200126:'吉他',200127:'萨克斯',200128:'架子鼓',
  200129:'钻石',200130:'翡翠',200131:'和田玉',200132:'红宝石',200133:'海豚',
  200134:'白鲸',200135:'小丑鱼',200136:'大白鲨'
};

const TYPES = {
  100001:{name:'国家',words:[200001,200002,200003,200004,200005,200006,200007,200008]},
  100002:{name:'球类运动',words:[200009,200010,200011,200012]},
  100003:{name:'田径运动',words:[200013,200014,200015,200016]},
  100004:{name:'快餐',words:[200017,200018,200019,200020]},
  100005:{name:'饮料',words:[200021,200022,200023,200024]},
  100006:{name:'军事武器',words:[200025,200026,200027,200028]},
  100007:{name:'交通工具',words:[200029,200030,200031,200032]},
  100008:{name:'上装',words:[200033,200034,200035,200036]},
  100009:{name:'裤装',words:[200037,200038,200039,200040]},
  100010:{name:'头饰',words:[200041,200042,200043,200044]},
  100011:{name:'水果',words:[200045,200046,200047,200048]},
  100012:{name:'蔬菜',words:[200049,200050,200051,200052]},
  100013:{name:'政府机关',words:[200053,200054,200055,200056]},
  100014:{name:'商业店铺',words:[200057,200058,200059,200060]},
  100015:{name:'电子设备',words:[200061,200062,200063,200064]},
  100016:{name:'超级英雄',words:[200065,200066,200067,200068]},
  100017:{name:'汽车品牌',words:[200069,200070,200071,200072]},
  100018:{name:'宠物',words:[200073,200074,200075,200076]},
  100019:{name:'职业',words:[200077,200078,200079,200080]},
  100020:{name:'爬行动物',words:[200081,200082,200083,200084]},
  100021:{name:'动漫',words:[200085,200086,200087,200088]},
  100022:{name:'理科',words:[200089,200090,200091,200092]},
  100023:{name:'文科',words:[200093,200094,200095,200096]},
  100024:{name:'游戏',words:[200097,200098,200099,200100]},
  100025:{name:'游戏岗位',words:[200101,200102,200103,200104]},
  100026:{name:'中国城市',words:[200105,200106,200107,200108]},
  100027:{name:'美国城市',words:[200109,200110,200111,200112]},
  100028:{name:'家用电器',words:[200113,200114,200115,200116]},
  100029:{name:'花卉',words:[200117,200118,200119,200120]},
  100030:{name:'酒',words:[200121,200122,200123,200124]},
  100031:{name:'乐器',words:[200125,200126,200127,200128]},
  100032:{name:'珠宝',words:[200129,200130,200131,200132]},
  100033:{name:'海洋生物',words:[200133,200134,200135,200136]}
};

const LEVELS = [
  {id:10001,wordCount:8,colCount:2,qmarkCount:0},
  {id:10002,wordCount:16,colCount:2,qmarkCount:0},
  {id:10003,wordCount:20,colCount:3,qmarkCount:0},
  {id:10004,wordCount:24,colCount:3,qmarkCount:0},
  {id:10005,wordCount:28,colCount:4,qmarkCount:0},
  {id:10006,wordCount:32,colCount:4,qmarkCount:0},
  {id:10007,wordCount:28,colCount:4,qmarkCount:4},
  {id:10008,wordCount:32,colCount:4,qmarkCount:5},
  {id:10009,wordCount:36,colCount:5,qmarkCount:6},
  {id:10010,wordCount:40,colCount:5,qmarkCount:7},
  {id:10011,wordCount:44,colCount:5,qmarkCount:8},
  {id:10012,wordCount:32,colCount:4,qmarkCount:6},
  {id:10013,wordCount:36,colCount:4,qmarkCount:7},
  {id:10014,wordCount:40,colCount:5,qmarkCount:8},
  {id:10015,wordCount:44,colCount:5,qmarkCount:10},
  {id:10016,wordCount:32,colCount:4,qmarkCount:7},
  {id:10017,wordCount:36,colCount:4,qmarkCount:9},
  {id:10018,wordCount:40,colCount:5,qmarkCount:8},
  {id:10019,wordCount:44,colCount:5,qmarkCount:11},
  {id:10020,wordCount:32,colCount:4,qmarkCount:6},
  {id:10021,wordCount:36,colCount:4,qmarkCount:9},
  {id:10022,wordCount:40,colCount:5,qmarkCount:8},
  {id:10023,wordCount:44,colCount:5,qmarkCount:11},
  {id:10024,wordCount:32,colCount:4,qmarkCount:6},
  {id:10025,wordCount:36,colCount:4,qmarkCount:9},
  {id:10026,wordCount:40,colCount:5,qmarkCount:8},
  {id:10027,wordCount:44,colCount:5,qmarkCount:11},
  {id:10028,wordCount:32,colCount:4,qmarkCount:7},
  {id:10029,wordCount:36,colCount:4,qmarkCount:10},
  {id:10030,wordCount:44,colCount:5,qmarkCount:13}
];

const TYPE_COLORS = [
  '#e94560','#4ecca3','#ff9800','#2196f3','#9c27b0',
  '#00bcd4','#ff5722','#8bc34a','#ffc107','#795548',
  '#607d8b','#e91e63','#3f51b5','#009688','#cddc39'
];

// ============================================================
// 二、工具函数
// ============================================================

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomPick(arr, n) {
  return shuffle(arr).slice(0, n);
}

// ============================================================
// 三、关卡生成
// ============================================================

function tryGenerate(levelConfig) {
  const {id, wordCount, colCount, qmarkCount} = levelConfig;
  const typeCount = wordCount / 4;
  const typeIds = Object.keys(TYPES).map(Number);

  // 随机选类型（每个类型提供4个词）
  const pickedTypeIds = randomPick(typeIds, typeCount);

  // 为每个选中类型分配颜色
  const colors = {};
  const usedColorIndices = new Set();
  for (const tid of pickedTypeIds) {
    let ci = Math.floor(Math.random() * TYPE_COLORS.length);
    while (usedColorIndices.has(ci)) {
      ci = Math.floor(Math.random() * TYPE_COLORS.length);
    }
    usedColorIndices.add(ci);
    colors[tid] = TYPE_COLORS[ci];
  }

  // 从每个类型中挑4个单词
  const wordPool = [];
  for (const tid of pickedTypeIds) {
    const typeWords = TYPES[tid].words;
    const picked = randomPick(typeWords, 4);
    for (const wid of picked) {
      wordPool.push({wordId: wid, typeId: tid, text: WORDS[wid]});
    }
  }

  // 洗牌后平分到各列
  const shuffled = shuffle(wordPool);
  const columns = [];
  for (let c = 0; c < colCount; c++) {
    columns.push([]);
  }
  for (let i = 0; i < shuffled.length; i++) {
    columns[i % colCount].push(shuffled[i]);
  }

  // 标记问号（从每列非顶部位置随机选）
  const qmarkPositions = new Set();
  const flatPositions = [];
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < columns[c].length; r++) {
      flatPositions.push({c, r});
    }
  }
  const titlePositions = new Set();
  for (let c = 0; c < colCount; c++) {
    if (columns[c].length > 0) {
      titlePositions.add(c + ',0');
    }
  }
  const candidates = flatPositions.filter(p => !titlePositions.has(p.c + ',' + p.r));
  if (qmarkCount > 0 && candidates.length > 0) {
    const picked = randomPick(candidates, qmarkCount);
    for (const p of picked) {
      qmarkPositions.add(p.c + ',' + p.r);
    }
  }

  return {columns, colors, qmarkPositions};
}

// ============================================================
// 四、可解性检查（与HTML中的checkSolvable逻辑一致）
// ============================================================

function checkSolvable(genData, wordCount) {
  const {columns, qmarkPositions} = genData;

  const maxNodes = wordCount <= 24 ? 100000 : (wordCount <= 32 ? 500000 : (wordCount <= 40 ? 2000000 : 3000000));
  const startTime = Date.now();
  const timeLimit = wordCount <= 28 ? 3000 : (wordCount <= 36 ? 8000 : (wordCount <= 40 ? 15000 : 25000));

  const cols = columns.map(col => col.map(w => ({wordId:w.wordId, typeId:w.typeId})));
  const storage = [null, null, null];
  const catBoxes = [
    {typeId: null, words: []},
    {typeId: null, words: []}
  ];

  const visited = new Set();
  const maxDepth = 300;
  let nodesExplored = 0;

  function stateKey() {
    const colKeys = cols.map(c => c.map(w => `${w.wordId}:${w.typeId}`).join(',')).join('|');
    const catKeys = catBoxes.map(b => `${b.typeId||'null'}:${b.words.map(w=>w.wordId).join(',')}`).join('|');
    const storeKey = storage.map(s => s ? `${s.wordId}:${s.typeId}` : 'null').join(',');
    return [colKeys, catKeys, storeKey].join('|||');
  }

  function isWin() {
    const allColsEmpty = cols.every(c => c.length === 0);
    const allCatsEmpty = catBoxes.every(b => b.words.length === 0);
    return allColsEmpty && allCatsEmpty;
  }

  function autoEliminate() {
    for (const box of catBoxes) {
      if (box.words.length >= 4) {
        box.words = [];
        box.typeId = null;
      }
    }
  }

  function getMoves() {
    const moves = [];

    // 1. 从列顶拖到分类框
    for (let c = 0; c < cols.length; c++) {
      if (cols[c].length === 0) continue;
      const word = cols[c][0];
      for (let b = 0; b < catBoxes.length; b++) {
        const box = catBoxes[b];
        if (box.words.length >= 4) continue;
        if (box.typeId === null || box.typeId === word.typeId) {
          moves.push({type:'colToCat', col:c, box:b, word});
        }
      }
    }

    // 2. 从列顶拖到存储框
    for (let c = 0; c < cols.length; c++) {
      if (cols[c].length === 0) continue;
      const word = cols[c][0];
      for (let s = 0; s < storage.length; s++) {
        if (storage[s] === null) {
          moves.push({type:'colToStorage', col:c, storage:s, word});
        }
      }
    }

    // 3. 从存储框拖到分类框
    for (let s = 0; s < storage.length; s++) {
      if (storage[s] === null) continue;
      const word = storage[s];
      for (let b = 0; b < catBoxes.length; b++) {
        const box = catBoxes[b];
        if (box.words.length >= 4) continue;
        if (box.typeId === null || box.typeId === word.typeId) {
          moves.push({type:'storageToCat', storage:s, box:b, word});
        }
      }
    }

    // 4. 从分类框拖到另一个分类框
    for (let srcBox = 0; srcBox < catBoxes.length; srcBox++) {
      const src = catBoxes[srcBox];
      if (src.words.length === 0) continue;
      for (const word of src.words) {
        for (let dstBox = 0; dstBox < catBoxes.length; dstBox++) {
          if (srcBox === dstBox) continue;
          const dst = catBoxes[dstBox];
          if (dst.words.length >= 4) continue;
          if (dst.typeId === null || dst.typeId === word.typeId) {
            moves.push({type:'catToCat', srcBox, dstBox, word,
              savedSrc: {typeId: src.typeId, words: [...src.words]}});
          }
        }
      }
    }

    return moves;
  }

  function applyMove(move) {
    if (move.type === 'colToCat') {
      move._savedBox = {typeId: catBoxes[move.box].typeId, words: [...catBoxes[move.box].words]};
      cols[move.col].shift();
      catBoxes[move.box].typeId = move.word.typeId;
      catBoxes[move.box].words.push(move.word);
      autoEliminate();
    } else if (move.type === 'colToStorage') {
      cols[move.col].shift();
      storage[move.storage] = move.word;
    } else if (move.type === 'storageToCat') {
      move._savedBox = {typeId: catBoxes[move.box].typeId, words: [...catBoxes[move.box].words]};
      storage[move.storage] = null;
      catBoxes[move.box].typeId = move.word.typeId;
      catBoxes[move.box].words.push(move.word);
      autoEliminate();
    } else if (move.type === 'catToCat') {
      move._savedDst = {typeId: catBoxes[move.dstBox].typeId, words: [...catBoxes[move.dstBox].words]};
      const src = catBoxes[move.srcBox];
      const idx = src.words.indexOf(move.word);
      if (idx !== -1) src.words.splice(idx, 1);
      if (src.words.length === 0) src.typeId = null;
      catBoxes[move.dstBox].typeId = move.word.typeId;
      catBoxes[move.dstBox].words.push(move.word);
      autoEliminate();
    }
  }

  function undoMove(move) {
    if (move.type === 'colToCat') {
      catBoxes[move.box].typeId = move._savedBox.typeId;
      catBoxes[move.box].words = move._savedBox.words;
      cols[move.col].unshift(move.word);
    } else if (move.type === 'colToStorage') {
      storage[move.storage] = null;
      cols[move.col].unshift(move.word);
    } else if (move.type === 'storageToCat') {
      catBoxes[move.box].typeId = move._savedBox.typeId;
      catBoxes[move.box].words = move._savedBox.words;
      storage[move.storage] = move.word;
    } else if (move.type === 'catToCat') {
      catBoxes[move.dstBox].typeId = move._savedDst.typeId;
      catBoxes[move.dstBox].words = move._savedDst.words;
      catBoxes[move.srcBox].typeId = move.savedSrc.typeId;
      catBoxes[move.srcBox].words = move.savedSrc.words;
    }
  }

  function dfs(depth) {
    if (depth > maxDepth) return false;
    nodesExplored++;
    if (nodesExplored > maxNodes) return false;
    if (nodesExplored % 5000 === 0 && Date.now() - startTime > timeLimit) return false;
    if (isWin()) return true;

    const key = stateKey();
    if (visited.has(key)) return false;
    visited.add(key);

    const moves = getMoves();
    moves.sort((a, b) => {
      function isMatch(m) {
        if (m.type === 'colToCat' || m.type === 'storageToCat') {
          return catBoxes[m.box].typeId === m.word.typeId;
        }
        if (m.type === 'catToCat') {
          return catBoxes[m.dstBox].typeId === m.word.typeId;
        }
        return false;
      }
      const aMatch = isMatch(a) ? 0 : 1;
      const bMatch = isMatch(b) ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      const aIsCat = (a.type === 'colToCat' || a.type === 'storageToCat' || a.type === 'catToCat') ? 0 : 1;
      const bIsCat = (b.type === 'colToCat' || b.type === 'storageToCat' || b.type === 'catToCat') ? 0 : 1;
      return aIsCat - bIsCat;
    });

    for (const move of moves) {
      applyMove(move);
      if (dfs(depth + 1)) return true;
      undoMove(move);
    }
    return false;
  }

  return dfs(0);
}

function generateLevel(levelConfig) {
  let result = null;
  let attempts = 0;
  const maxAttempts = levelConfig.wordCount >= 40 ? 30 : 200;

  while (!result && attempts < maxAttempts) {
    attempts++;
    const gen = tryGenerate(levelConfig);
    if (checkSolvable(gen, levelConfig.wordCount)) {
      result = gen;
    }
  }

  if (!result) {
    console.warn(`关卡 ${levelConfig.id} 经${maxAttempts}次尝试无法生成可解关卡，使用最后一次结果（跳过验证）`);
    result = tryGenerate(levelConfig);
  }

  return {result, attempts};
}

// ============================================================
// 五、离线烤制全部关卡
// ============================================================

function bakeAllLevels() {
  console.log('开始离线生成全部关卡...\n');

  const baked = {};
  let totalTime = 0;

  for (let i = 0; i < LEVELS.length; i++) {
    const lvl = LEVELS[i];
    const startTime = Date.now();
    const {result, attempts} = generateLevel(lvl);
    const elapsed = Date.now() - startTime;
    totalTime += elapsed;

    // 将关键数据提取为简洁的可序列化格式
    const columns = result.columns.map(col =>
      col.map(w => ({
        wid: w.wordId,
        tid: w.typeId,
        txt: WORDS[w.wordId]
      }))
    );

    const qmarkArray = [];
    for (let c = 0; c < columns.length; c++) {
      for (let r = 0; r < columns[c].length; r++) {
        if (result.qmarkPositions.has(c + ',' + r)) {
          qmarkArray.push([c, r]);
        }
      }
    }

    baked[lvl.id] = {
      columns,
      colors: result.colors,
      qmarks: qmarkArray
    };

    console.log(`关卡 ${lvl.id} (${lvl.wordCount}词|${lvl.colCount}列|${lvl.qmarkCount}问号) — ${attempts}次尝试 — ${(elapsed/1000).toFixed(1)}s`);
  }

  console.log(`\n全部完成！总耗时 ${(totalTime/1000).toFixed(1)}s`);

  // 写JSON文件
  const outPath = path.join(__dirname, 'baked_levels.json');
  fs.writeFileSync(outPath, JSON.stringify(baked, null, 2), 'utf8');
  console.log(`数据已保存到 ${outPath}`);

  // 同时输出为JS代码片段（可直接嵌入HTML）
  let jsOut = '// 预烘焙关卡数据（离线生成）\nconst BAKED_LEVELS = {\n';
  const keys = Object.keys(baked).map(Number).sort((a,b)=>a-b);
  for (const id of keys) {
    const lvl = baked[id];
    jsOut += `  ${id}: {\n`;
    jsOut += `    columns: ${JSON.stringify(lvl.columns)},\n`;
    jsOut += `    colors: ${JSON.stringify(lvl.colors)},\n`;
    jsOut += `    qmarks: ${JSON.stringify(lvl.qmarks)}\n`;
    jsOut += `  },\n`;
  }
  jsOut += '};\n';

  const jsPath = path.join(__dirname, 'baked_levels.js');
  fs.writeFileSync(jsPath, jsOut, 'utf8');
  console.log(`JS代码已保存到 ${jsPath}`);

  return baked;
}

bakeAllLevels();
