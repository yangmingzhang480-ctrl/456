export interface AttributeData {
  key: string; label: string; value: number; max: number;
  gradientFrom: string; gradientTo: string;
}

export interface NpcData {
  id: string; name: string; title: string; relationship: string;
  affinity: number; loyalty: number; backstory: string;
  cultivationRealm: string; appearance: string; quote: string;
}

export interface RealmNode {
  id: string; name: string; x: number; y: number;
  connections: string[]; isCorrupted: boolean; description: string;
}

export interface InventoryItem {
  id: string; name: string; grade: string; description: string;
  condition: '完整' | '残破' | '微损' | '封印';
}

export interface ReincarnationRecord {
  id: string; deathNumber: number; cause: string; insight: string;
  memoryFragments: string[];
}

export interface NotificationItem {
  id: string;
  type: 'breakthrough' | 'attack' | 'warning' | 'divine' | 'system';
  title: string;
  message: string;
  duration?: number;
}

export type PanelId = 'dashboard' | 'chat' | 'tavern' | 'inventory' | 'map' | 'npc' | 'records' | 'settings';

export const FAKE_CHARACTER = {
  name: '陆星遥',
  realm: '紫府境 · 三重',
  title: '太虚剑宗 · 真传弟子',
  description: '天生道体，七岁引气入体，十五岁筑基，二十三岁结丹。于黑海之劫中觉醒前世轮回记忆，自此踏上逆天寻道之路。',
};

export const FAKE_ATTRIBUTES: AttributeData[] = [
  { key: 'life', label: '生命', value: 780, max: 1000, gradientFrom: '#00e676', gradientTo: '#00bcd4' },
  { key: 'spirit', label: '灵力', value: 620, max: 1000, gradientFrom: '#7c4dff', gradientTo: '#448aff' },
  { key: 'cultivation', label: '修为', value: 450, max: 1000, gradientFrom: '#ffd740', gradientTo: '#ff9100' },
  { key: 'blood', label: '精血', value: 340, max: 1000, gradientFrom: '#ff5252', gradientTo: '#d50000' },
  { key: 'sense', label: '神识', value: 890, max: 1000, gradientFrom: '#e040fb', gradientTo: '#7c4dff' },
  { key: 'heart', label: '道心', value: 720, max: 1000, gradientFrom: '#00e5ff', gradientTo: '#1de9b6' },
];

export const FAKE_WORLD_STATE = {
  coordinates: '东荒 · 太虚山脉 · 主峰',
  dayPhase: '黄昏' as const,
  corruptionLevel: 34,
  remainingDaylight: '二时辰三刻',
  spiritTide: '涨潮',
};

export const FAKE_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: '太阴玄水', grade: '天阶·下品', description: '取自太阴星核心的玄阴之水，可洗涤神魂、净除心魔。每次使用可提升神识属性。', condition: '完整' },
  { id: 'i2', name: '镇世天龙气', grade: '帝阶·残篇', description: '上古天龙陨落时遗落的一缕龙气，蕴含龙族神通之秘。残破不堪，需寻得龙族血脉修复。', condition: '残破' },
  { id: 'i3', name: '敛息决', grade: '玄阶·上品', description: '收敛自身气息的法门，修炼至大成可将气息完全隐匿，黑海异族亦无法察觉。', condition: '完整' },
  { id: 'i4', name: '九转还魂丹', grade: '地阶·极品', description: '以九种珍稀灵药炼制，可在濒死之际保住一线生机，但药效霸道需紫府境以上方可承受。', condition: '完整' },
  { id: 'i5', name: '碎星剑诀', grade: '天阶·中品', description: '太虚剑宗镇宗剑诀之一，修炼至极致可一剑碎星。因传承残缺，仅存前五式。', condition: '微损' },
  { id: 'i6', name: '玄天鉴', grade: '圣阶·封印', description: '上古大能遗留的洞察之宝，可窥探天机因果。被强力封印所镇，需集齐五枚天机令方可解封。', condition: '封印' },
  { id: 'i7', name: '虚空纳戒', grade: '地阶·中品', description: '内含百丈空间的储物戒指，行走修界的必备之物。内有灵纹阵法维持空间稳定。', condition: '完整' },
  { id: 'i8', name: '紫府炼神诀', grade: '天阶·上品', description: '紫府境修炼神识的无上法门。每修炼一层神识翻倍增长，但需消耗大量天材地宝。', condition: '残破' },
];

export const FAKE_NPCS: NpcData[] = [
  { id: 'n1', name: '李明远', title: '太虚剑宗 · 外门长老', relationship: '发小', affinity: 85, loyalty: 70,
    backstory: '与陆星遥同村长大，一起拜入太虚剑宗。性格憨厚，资质平平却勤恳踏实。太虚剑宗被黑海异族围困时，率三百弟子坚守山门七日不破。',
    cultivationRealm: '金丹境 · 七重', appearance: '魁梧身形，面有刀疤，常年着一身灰布道袍，背负一柄厚重的玄铁重剑。', quote: '星遥哥，俺信你！刀山火海，俺李胖子跟你走。' },
  { id: 'n2', name: '叶汐澜', title: '太虚剑宗 · 真传首席', relationship: '道侣', affinity: 95, loyalty: 90,
    backstory: '太虚剑宗太上长老叶孤寒之女，天资绝世。与陆星遥在太古秘境中共同对抗上古凶兽，生死相依后结为道侣。二人曾立下天道誓言：万劫不复，不负彼此。',
    cultivationRealm: '紫府境 · 九重', appearance: '一袭白衣胜雪，青丝如瀑垂至腰际，面覆轻纱下是一双清冷如月的眸子。指尖常萦绕一缕冰魄寒气。', quote: '此去黑海，我陪你。天道若阻，斩了便是。' },
  { id: 'n3', name: '血影老人', title: '散修 · 魔道', relationship: '宿敌', affinity: 10, loyalty: 5,
    backstory: '修行邪功《血影大法》的散修，曾屠戮凡俗村落炼制血器。被陆星遥斩杀后，以秘法转生，如今实力大进，屡次设局报复。',
    cultivationRealm: '紫府境 · 五重', appearance: '枯瘦老者，一身暗红血袍无风自动，双目赤红如血，周身环绕着猩红的雾气。', quote: '小辈，血债必须血偿！待我吞噬你的精血，必能突破元婴之境。' },
  { id: 'n4', name: '云姬', title: '天机阁 · 少阁主', relationship: '盟友', affinity: 60, loyalty: 45,
    backstory: '天机阁阁主独女，精通推演天机之术。与陆星遥有一桩交易：她借天机阁情报网为其寻路，陆星遥替她取一件遗落在黑海的旧物。关系微妙，亦敌亦友。',
    cultivationRealm: '元婴境 · 三重', appearance: '紫衣罗裙摇曳生姿，手持一柄玉骨折扇轻摇，眸中常含星光流转，笑靥如花却令人看不透深浅。', quote: '陆公子，天机阁的情报可是很贵的……不过，对你，可以破例。' },
  { id: 'n5', name: '玄钟', title: '太古神山 · 护山神兽', relationship: '契约灵兽', affinity: 80, loyalty: 95,
    backstory: '太古神山的守护神兽，本体为玄天龟。因上古血脉契约与陆星遥的前世结下羁绊，今生再次相遇后重新订立契约。看似慵懒，实则洞察万物。',
    cultivationRealm: '化神境 · 一重', appearance: '巴掌大的玄色小龟，龟甲上遍布着金色的古老纹路，一双绿豆大的眼睛如星辰般深邃。', quote: '少年，你又弱了。吾当年追随的主人，可是能一脚踏碎星辰的。' },
];

export const FAKE_REALMS: RealmNode[] = [
  { id: 'r1', name: '大日天', x: 50, y: 10, connections: ['r2', 'r3'], isCorrupted: false, description: '诸天万界之中心，太阳星所在之处。万千法则起源之地，仙家共尊。' },
  { id: 'r2', name: '大赤天', x: 20, y: 28, connections: ['r1', 'r4'], isCorrupted: true, description: '赤色荒原无边无际。已被黑海异族攻破第二重天关，生灵涂炭。' },
  { id: 'r3', name: '太初天', x: 78, y: 22, connections: ['r1', 'r5'], isCorrupted: false, description: '生灵繁盛的古老天域。灵气充沛如实质，万族和谐共处。' },
  { id: 'r4', name: '苍莽天', x: 15, y: 52, connections: ['r2', 'r6'], isCorrupted: true, description: '蛮荒凶兽横行之地。已部分被黑海吞噬，仅余几处人族据点苦苦支撑。' },
  { id: 'r5', name: '钧霄天', x: 72, y: 55, connections: ['r3', 'r6'], isCorrupted: false, description: '天机阁所在。推演天象、洞察万物，乃是诸天情报交汇之地。' },
  { id: 'r6', name: '元极天', x: 44, y: 72, connections: ['r4', 'r5'], isCorrupted: false, description: '万法归宗之地。上古大能遗迹遍布，传闻元极天深处有通往仙界的古路。' },
];

export const FAKE_RECORDS: ReincarnationRecord[] = [
  { id: 'rec1', deathNumber: 1, cause: '筑基天劫 · 第九重雷劫', insight: '天劫非劫难，乃天地之考验。不可硬抗，需借天地之势化解。',
    memoryFragments: ['雷光中看见一道青衫身影负手而立', '手心有一枚紫色的符文在缓缓闪烁', '有声音道：九世轮回，你终于走到了这一步'] },
  { id: 'rec2', deathNumber: 2, cause: '魔道修士围攻 · 血影门', insight: '独木难支，须结道友之力。修道之路非一人可独行。',
    memoryFragments: ['血色阵法笼罩天地之间', '耳畔回响着古老的献祭咒语', '一柄黑色的飞剑贯穿胸膛'] },
  { id: 'rec3', deathNumber: 3, cause: '上古禁地 · 噬魂迷雾', insight: '神识不足时不可深入未知禁地，贪婪是最大的劫数。',
    memoryFragments: ['迷雾中有人反复呼唤我的名字', '脚下是无尽的白色骨骸铺成的路', '一枚古旧的玉佩在迷雾中发出微光'] },
  { id: 'rec4', deathNumber: 4, cause: '黑海异兽 · 深渊巨鱿', insight: '黑海生物对灵力波动极度敏感，需修炼敛息之术方可安全穿行黑海。',
    memoryFragments: ['巨大的触须从黑海中猛然升起', '天空被染成了不祥的暗紫色', '一艘残破的古船在黑色海面上漂流'] },
  { id: 'rec5', deathNumber: 5, cause: '道心破碎 · 情劫反噬', insight: '情劫亦是心劫。爱别离、怨憎会、求不得——勘破方得自在，而非逃避。',
    memoryFragments: ['一张模糊却温柔的脸，泪水滴落在手心', '有声音说：下一世，我等你，无论多久', '指尖触碰的刹那，化作漫天光尘'] },
];
