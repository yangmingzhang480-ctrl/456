export type AttributeKey = '肉身' | '灵力' | '神识' | '道心' | '精血' | '气运';

export interface AttributeValue {
  key: AttributeKey;
  value: number;
  max: number;
  tone: 'gold' | 'jade' | 'ice' | 'violet' | 'blood' | 'amber';
}

export interface CharacterProfile {
  id: string;
  name: string;
  seal: string;
  fate: string;
  realm: string;
  location: string;
  locationId: string;
  status: '稳定' | '危险' | '失联' | '侵蚀';
  title: string;
  color: string;
  portrait: { src: string; position: string; scale: number };
  quote: string;
  risk: string;
  cultivation: string;
  combatSkills: string[];
  bagItems: string[];
  attributes: AttributeValue[];
  bonds: string[];
}

export interface MapNode {
  id: string;
  name: string;
  kind: 'sun' | 'realm' | 'rift' | 'city' | 'relic' | 'danger' | 'sacred';
  x: number;
  y: number;
  threat: string;
  desc: string;
  characters: string[];
  actions: string[];
}

export interface SkillNode {
  id: string;
  name: string;
  owner: string;
  grade: string;
  progress: number;
  risk: string;
  desc: string;
  x: number;
  y: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  grade: string;
  state: string;
  desc: string;
}

export interface RecordItem {
  id: string;
  title: string;
  category: string;
  body: string;
  severity: 'info' | 'warning' | 'danger';
}

export const characters: CharacterProfile[] = [
  {
    id: 'luxingyao',
    name: '陆星遥',
    seal: '星',
    fate: '九世轮回者，前世为上古剑仙残魂',
    realm: '紫府境·三重',
    location: '荒骨城外城',
    locationId: 'bone-city',
    status: '稳定',
    title: '太虚剑宗真传',
    color: '#d4af37',
    portrait: { src: '/assets/xuanling-party-reference.jpg', position: '50% 72%', scale: 1.2 },
    quote: '剑心尚明，黑海未能覆其本真。',
    risk: '灵力过载时会触发前世剑意回潮。',
    cultivation: '太虚九转剑经',
    combatSkills: ['太虚剑心', '星河断因', '轮回照影'],
    bagItems: ['星河残印', '太虚剑穗', '荒骨城防令'],
    attributes: [
      { key: '肉身', value: 78, max: 100, tone: 'gold' },
      { key: '灵力', value: 92, max: 100, tone: 'violet' },
      { key: '神识', value: 85, max: 100, tone: 'ice' },
      { key: '道心', value: 60, max: 100, tone: 'amber' },
      { key: '精血', value: 45, max: 100, tone: 'blood' },
      { key: '气运', value: 70, max: 100, tone: 'jade' },
    ],
    bonds: ['与叶汐澜存在剑魄旧约', '被黑海裂隙低频注视'],
  },
  {
    id: 'limingyuan',
    name: '李明远',
    seal: '明',
    fate: '护山灵兽转世，肉身承载太古山纹',
    realm: '金丹境·七重',
    location: '太虚剑碑',
    locationId: 'sword-relic',
    status: '稳定',
    title: '太虚剑宗外门长老',
    color: '#2ecc71',
    portrait: { src: '/assets/xuanling-party-reference.jpg', position: '51% 25%', scale: 1.28 },
    quote: '山纹入骨，万劫不折。',
    risk: '若离开神山灵脉太久，肉身山纹会出现裂化。',
    cultivation: '山纹不灭体',
    combatSkills: ['镇岳护阵', '玄岩反震', '太古山息'],
    bagItems: ['神山石符', '护阵铜令', '灵脉测尺'],
    attributes: [
      { key: '肉身', value: 95, max: 100, tone: 'gold' },
      { key: '灵力', value: 55, max: 100, tone: 'violet' },
      { key: '神识', value: 40, max: 100, tone: 'ice' },
      { key: '道心', value: 88, max: 100, tone: 'amber' },
      { key: '精血', value: 72, max: 100, tone: 'blood' },
      { key: '气运', value: 50, max: 100, tone: 'jade' },
    ],
    bonds: ['守护陆星遥的九世剑约', '与太古神山灵脉共振'],
  },
  {
    id: 'yexilan',
    name: '叶汐澜',
    seal: '汐',
    fate: '冰魄仙尊转世，魂海残留黑潮倒影',
    realm: '紫府境·九重',
    location: '黑海裂隙第三层',
    locationId: 'black-rift',
    status: '危险',
    title: '太虚剑宗真传首席',
    color: '#74d7ff',
    portrait: { src: '/assets/xuanling-party-reference.jpg', position: '18% 51%', scale: 1.38 },
    quote: '她听见裂隙深处有人以旧名呼唤。',
    risk: '黑海侵蚀值已越过警戒线，需立刻回收神识锚点。',
    cultivation: '冰魄照海诀',
    combatSkills: ['冰魄照海', '裂隙回声', '神识锚定'],
    bagItems: ['裂隙镇魂针', '冰魄残镜', '净魂玉匣'],
    attributes: [
      { key: '肉身', value: 30, max: 100, tone: 'gold' },
      { key: '灵力', value: 98, max: 100, tone: 'violet' },
      { key: '神识', value: 92, max: 100, tone: 'ice' },
      { key: '道心', value: 95, max: 100, tone: 'amber' },
      { key: '精血', value: 18, max: 100, tone: 'blood' },
      { key: '气运', value: 40, max: 100, tone: 'jade' },
    ],
    bonds: ['与陆星遥共享前世剑魄', '被裂隙中的未知天魔标记'],
  },
  {
    id: 'chulingshuang',
    name: '楚凌霜',
    seal: '霜',
    fate: '弑神之刃转世，命格被天机阁封存',
    realm: '金丹境·九重',
    location: '钧霄天机阁',
    locationId: 'blood-marsh',
    status: '侵蚀',
    title: '散修剑道天才',
    color: '#a78bfa',
    portrait: { src: '/assets/xuanling-party-reference.jpg', position: '78% 48%', scale: 1.34 },
    quote: '她的命盘有一半被暗红火漆封死。',
    risk: '因果链正在向黑海侵蚀区偏移。',
    cultivation: '弑神命刃',
    combatSkills: ['命盘斩线', '血影追索', '封火破禁'],
    bagItems: ['命盘火漆', '血影短刃', '天机阁封签'],
    attributes: [
      { key: '肉身', value: 65, max: 100, tone: 'gold' },
      { key: '灵力', value: 75, max: 100, tone: 'violet' },
      { key: '神识', value: 58, max: 100, tone: 'ice' },
      { key: '道心', value: 42, max: 100, tone: 'amber' },
      { key: '精血', value: 80, max: 100, tone: 'blood' },
      { key: '气运', value: 88, max: 100, tone: 'jade' },
    ],
    bonds: ['与天机阁存在封印契约', '被血影沼泽旧神残识追索'],
  },
];

export const macroNodes: MapNode[] = [
  { id: 'great-sun', name: '大日天', kind: 'sun', x: 50, y: 12, threat: '天火稳定', desc: '诸天中枢，太阳星高悬，残缺天道仍在此处维持秩序。', characters: [], actions: ['观测星轨', '校准轮回锚点'] },
  { id: 'dachitian', name: '大赤天', kind: 'realm', x: 21, y: 31, threat: '边境沦陷', desc: '赤色荒原无边，第二重天关已被黑海异族破开。', characters: [], actions: ['侦测黑潮', '修补界壁'] },
  { id: 'taichutian', name: '太初天', kind: 'realm', x: 78, y: 28, threat: '灵脉震荡', desc: '古老生灵繁盛之地，世界树根须正在枯化。', characters: [], actions: ['采集灵脉样本', '寻找树心印记'] },
  { id: 'yuanjitian', name: '元极天', kind: 'sacred', x: 52, y: 70, threat: '主战场', desc: '万法归算之地，荒骨城与黑海裂隙皆位于此天。', characters: ['陆星遥', '李明远', '叶汐澜'], actions: ['进入现世战略图', '召集主角团'] },
  { id: 'black-sea', name: '黑海侵蚀区', kind: 'rift', x: 47, y: 44, threat: '极危', desc: '吞噬时空与命格的中心涡旋，裂隙正在向诸天蔓延。', characters: ['楚凌霜'], actions: ['封锁裂隙', '撤离失联者'] },
];

export const microNodes: MapNode[] = [
  { id: 'bone-city', name: '荒骨城', kind: 'city', x: 34, y: 58, threat: '可驻守', desc: '黑海边缘唯一的人族据点，以远古巨兽骸骨筑城。', characters: ['陆星遥'], actions: ['招募守城修士', '开启城防推演'] },
  { id: 'black-rift', name: '黑海裂隙', kind: 'rift', x: 70, y: 38, threat: '极危', desc: '黑海异族涌出的主要通道，时间流速在此处断裂。', characters: ['叶汐澜'], actions: ['布置神识锚', '强制撤离'] },
  { id: 'sword-relic', name: '太虚剑碑', kind: 'relic', x: 24, y: 72, threat: '灵压强', desc: '太虚剑宗先祖留下的剑道传承石碑，残留九世剑意。', characters: ['李明远'], actions: ['参悟剑碑', '稳固山纹'] },
  { id: 'blood-marsh', name: '血影沼泽', kind: 'danger', x: 58, y: 73, threat: '高危', desc: '血影老人藏匿的沼泽地带，雾中有旧神残识低语。', characters: ['楚凌霜'], actions: ['追踪命盘火漆', '清理血雾'] },
  { id: 'ancient-mountain', name: '太古神山', kind: 'sacred', x: 18, y: 28, threat: '封禁', desc: '比九天更古老的圣山，护山结界仍在抵御黑潮。', characters: [], actions: ['重启护山阵', '寻找灵脉源点'] },
];

export const skills: SkillNode[] = [
  { id: 'skill-sword-heart', name: '太虚剑心', owner: '陆星遥', grade: '天阶残篇', progress: 76, risk: '前世剑意回潮', desc: '以九世轮回磨砺出的剑道核心，可斩断黑海低阶因果。', x: 16, y: 34 },
  { id: 'skill-mountain-body', name: '山纹不灭体', owner: '李明远', grade: '地阶上品', progress: 68, risk: '离脉衰弱', desc: '以太古神山纹路淬体，擅长承压与护阵。', x: 37, y: 62 },
  { id: 'skill-ice-soul', name: '冰魄照海诀', owner: '叶汐澜', grade: '天阶禁法', progress: 89, risk: '黑潮倒灌', desc: '以冰魄仙魂映照黑海，但神识越强越容易听见裂隙回声。', x: 64, y: 34 },
  { id: 'skill-fate-blade', name: '弑神命刃', owner: '楚凌霜', grade: '未知封印', progress: 51, risk: '命盘反噬', desc: '被天机阁封存的杀伐命格，解封会快速改变战局。', x: 82, y: 66 },
];

export const inventory: InventoryItem[] = [
  { id: 'item-star-seal', name: '星河残印', type: '轮回信物', grade: '天阶', state: '微光复燃', desc: '能在 LLM 推演中固定一次关键选择，代价是暴露轮回痕迹。' },
  { id: 'item-bone-token', name: '荒骨城防令', type: '据点令牌', grade: '玄阶', state: '可调用', desc: '调动荒骨城外城三座骨塔，短时间提升防线稳定度。' },
  { id: 'item-rift-needle', name: '裂隙镇魂针', type: '封印法宝', grade: '地阶', state: '染血', desc: '用于钉住黑海裂隙边缘的魂针，叶汐澜附近会产生共鸣。' },
  { id: 'item-scroll', name: '残缺天道卷', type: '古卷', grade: '未知', state: '不可完全展开', desc: '卷面记录着元极天旧天道的断裂位置，文字会在夜半自行改写。' },
];

export const records: RecordItem[] = [
  { id: 'record-loop', title: '第九次轮回异常', category: '轮回秘录', body: '陆星遥醒来时，星河残印比上一世提前三日发热。天道残缺处出现了新的裂纹。', severity: 'warning' },
  { id: 'record-rift', title: '黑海第三层回声', category: '侵蚀情报', body: '叶汐澜在裂隙中听见了并不存在的旧名。该回声疑似具备反向定位能力。', severity: 'danger' },
  { id: 'record-city', title: '荒骨城防线暂稳', category: '据点纪要', body: '外城骨塔仍能运转，但城下灵脉已经出现墨蓝色结晶。', severity: 'info' },
  { id: 'record-fate', title: '楚凌霜命盘火漆松动', category: '天机缘法', body: '天机阁旧封印正在从内侧被刮开，封存内容与弑神之刃有关。', severity: 'warning' },
];

export const settingRows = [
  { id: 'setting-density', name: '文本密度', value: '卷宗密集', desc: '用于长篇 LLM 推演，优先保留上下文信息。' },
  { id: 'setting-motion', name: '演出强度', value: '灵动', desc: '开启流光、令牌浮动与危险呼吸动画。' },
  { id: 'setting-parser', name: '标签解析', value: 'maintext / option / vars', desc: '原型展示 LLM 游戏结构化输出入口。' },
  { id: 'setting-safety', name: '前端边界', value: '仅原型', desc: '本界面不新增后端，不保存真实密钥。' },
];


export interface TavernLorebook {
  id: string;
  name: string;
  trigger: string;
  priority: number;
  content: string;
}

export interface TavernVariable {
  id: string;
  name: string;
  value: string;
  tone: 'gold' | 'jade' | 'ice' | 'violet' | 'blood' | 'amber';
}

export const tavernLorebooks: TavernLorebook[] = [
  { id: 'lore-blacksea', name: '世界书：元极天黑海侵蚀', trigger: '黑海、裂隙、侵蚀、天魔', priority: 92, content: '黑海并非海洋，而是被天道剥离后的命格暗流。进入裂隙者会听见前世旧名，若回应三次，因果锚点将被黑海反向锁定。' },
  { id: 'lore-party', name: '世界书：四象轮回者关系网', trigger: '陆星遥、李明远、叶汐澜、楚凌霜', priority: 88, content: '四名主角分别承接星、山、汐、霜四枚轮回印。分散行动时可提高探索效率，但黑海会优先切断风险最高者的救援链路。' },
  { id: 'lore-bonecity', name: '世界书：荒骨城防线', trigger: '荒骨城、骨塔、城防令', priority: 74, content: '荒骨城由远古巨兽骸骨筑成，三座骨塔可短时稳定裂隙潮汐，但每次启动都会消耗城下灵脉。' },
];

export const tavernPreset = {
  name: '玄灵界末日修仙 RPG',
  mode: 'GameView',
  tags: ['thinking', 'maintext', 'option', 'sum', 'vars'],
  temperature: '0.82',
  context: '角色卡 + 世界书 + 变量状态 + 最近三轮卷宗',
};

export const tavernVariables: TavernVariable[] = [
  { id: 'var-corruption', name: '黑海侵蚀率', value: '67%', tone: 'blood' },
  { id: 'var-loop', name: '轮回序列', value: '第九次', tone: 'gold' },
  { id: 'var-anchor', name: '叶汐澜神识锚', value: '松动', tone: 'ice' },
  { id: 'var-fatewax', name: '楚凌霜命盘火漆', value: '半裂', tone: 'violet' },
  { id: 'var-bonecity', name: '荒骨城防线', value: '暂稳', tone: 'jade' },
  { id: 'var-tide', name: '下一次黑潮', value: '两刻后', tone: 'amber' },
];

export const tavernOutput = {
  thinking: '系统判定：叶汐澜神识锚点正在被黑海第三层反向牵引；若陆星遥单独入裂隙，前世剑意可短时斩断回声，但会暴露星河残印。',
  maintext: '荒骨城外，墨蓝色云墙压低到城楼上方。陆星遥掌心的星河残印灼痛，远处黑海裂隙像一枚缓慢睁开的眼。李明远守住太虚剑碑，山纹沿臂骨亮起；楚凌霜的命盘火漆裂开半寸，血色细光指向同一个方向。',
  options: ['调度陆星遥进入黑海裂隙，强行回收叶汐澜神识锚', '命令李明远启动太虚剑碑，先稳住荒骨城外城防线', '让楚凌霜解开一层命盘封印，以血影追索裂隙源头', '消耗星河残印，锁定一次不被黑海篡改的关键选择'],
  sum: '上一幕总结：四名轮回者已分散至荒骨城、太虚剑碑、黑海裂隙与血影沼泽。黑海侵蚀率上升至 67%，裂隙回声开始模拟主角团旧友声音。',
  vars: ['black_sea_corruption=67', 'yexilan_anchor=loose', 'chulingshuang_fatewax=half_cracked', 'bone_city_defense=stable'],
};
