import { useState } from 'react';
import type { CharacterProfile } from './MonitorPanel';

/* ---- Per-character data ---- */
export interface CharItem { id: string; name: string; grade: string; gradeCls: string; desc: string; }
export interface CharAbility { id: string; name: string; desc: string; mastery: number; }
export interface CharSkill { id: string; name: string; grade: string; gradeCls: string; desc: string; progress: number; max: number; }

export interface CharacterFullData {
  profile: CharacterProfile;
  items: CharItem[];
  abilities: CharAbility[];
  skills: CharSkill[];
}

const GRADE_CLASS: Record<string, string> = {
  '圣阶': 'card-premium-grade--saint', '帝阶': 'card-premium-grade--emperor',
  '天阶': 'card-premium-grade--heaven', '地阶': 'card-premium-grade--earth', '玄阶': 'card-premium-grade--mystic',
};

/* ---- 陆星遥 ---- */
const luxingyaoData: CharacterFullData = {
  profile: {
    id:'luxingyao',name:'陆星遥',title:'太虚剑宗·真传',realm:'紫府境·三重',avatarClass:'gold',tokenColor:'gold',
    location:'荒骨城·外城区',pastLife:'九世轮回者，前世为上古剑仙',isDanger:false,
    stats:[{key:'肉身',value:78,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:92,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:85,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:60,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:45,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:70,max:100,cssClass:'stat-fill--jade'}],
  },
  items: [
    {id:'lx-i1',name:'碎星剑',grade:'天阶',gradeCls:'card-premium-grade--heaven',desc:'太虚剑宗真传佩剑，剑身蕴含碎星剑诀的剑气烙印。剑出鞘时可引动星辰之力。'},
    {id:'lx-i2',name:'九转还魂丹',grade:'地阶',gradeCls:'card-premium-grade--earth',desc:'以九种珍稀灵药炼制，可在濒死之际保住一线生机。已服一丸，余两丸。'},
    {id:'lx-i3',name:'轮回玉佩',grade:'圣阶',gradeCls:'card-premium-grade--saint',desc:'伴随陆星遥九世轮回的玉佩，每一世都刻有不同的铭文。当前铭文：第五世·剑道通神。'},
  ],
  abilities: [
    {id:'lx-a1',name:'九转轮回诀',desc:'觉醒前世记忆，解锁前世能力。每觉醒一世，获得一种新的战斗本能。当前已觉醒五世。',mastery:56},
    {id:'lx-a2',name:'碎星剑意',desc:'将碎星剑诀的剑意融入神识，剑出时可撕裂空间。需紫府境以上方可修炼。',mastery:72},
    {id:'lx-a3',name:'天生道体',desc:'天生对天地灵气亲和度极高，修炼速度倍增。七岁即可引气入体，万中无一。',mastery:100},
  ],
  skills: [
    {id:'lx-s1',name:'碎星剑诀·破星式',grade:'天阶',gradeCls:'card-premium-grade--heaven',desc:'碎星剑诀第一式。以极快的剑速刺穿一点，破防威力极大。',progress:8,max:9},
    {id:'lx-s2',name:'碎星剑诀·断月式',grade:'天阶',gradeCls:'card-premium-grade--heaven',desc:'碎星剑诀第二式。横斩之剑，剑气如新月般横扫。',progress:6,max:9},
    {id:'lx-s3',name:'敛息决',grade:'玄阶',gradeCls:'card-premium-grade--mystic',desc:'收敛自身气息的法门，修炼至大成可完全隐匿，黑海异族亦无法察觉。',progress:5,max:9},
  ],
};

/* ---- 叶汐澜 ---- */
const yexilanData: CharacterFullData = {
  profile: {
    id:'yexilan',name:'叶汐澜',title:'太虚剑宗·真传首席',realm:'紫府境·九重',avatarClass:'ice',tokenColor:'ice',
    location:'黑海裂隙·第三层',pastLife:'前世为冰魄仙尊',isDanger:true,
    stats:[{key:'肉身',value:30,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:98,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:92,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:95,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:18,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:40,max:100,cssClass:'stat-fill--jade'}],
  },
  items: [
    {id:'yx-i1',name:'冰魄寒玉簪',grade:'天阶',gradeCls:'card-premium-grade--heaven',desc:'叶汐澜的本命法器，以万年冰魄炼制。簪中蕴含冰魄寒气本源，可冰封百里。'},
    {id:'yx-i2',name:'寒月轻纱',grade:'地阶',gradeCls:'card-premium-grade--earth',desc:'以极北冰蚕丝织就的面纱，不仅可抵御神识窥探，还能在战斗中凝聚寒气护体。'},
  ],
  abilities: [
    {id:'yx-a1',name:'冰魄寒气',desc:'叶汐澜的独门神通。极寒之力可冻结万物，连黑海异兽亦可暂时冰封。修炼至极可触及绝对零度法则。',mastery:89},
    {id:'yx-a2',name:'冰心诀',desc:'保持心神绝对冷静，不受任何精神攻击和心魔影响。在战斗中能做出最理性的判断。',mastery:95},
  ],
  skills: [
    {id:'yx-s1',name:'冰魄寒气·霜天',grade:'天阶',gradeCls:'card-premium-grade--heaven',desc:'冰魄寒气终极形态。将周围区域化为绝对零度的霜天领域。',progress:8,max:9},
    {id:'yx-s2',name:'冰封万里',grade:'天阶',gradeCls:'card-premium-grade--heaven',desc:'以自身为中心释放极寒冲击波，冻结范围内一切敌人。',progress:7,max:9},
    {id:'yx-s3',name:'寒月剑法',grade:'地阶',gradeCls:'card-premium-grade--earth',desc:'以寒气凝聚为剑的独特剑法，剑招飘渺如寒月。',progress:9,max:9},
  ],
};

/* ---- 李明远 ---- */
const limingyuanData: CharacterFullData = {
  profile: {
    id:'limingyuan',name:'李明远',title:'太虚剑宗·外门长老',realm:'金丹境·七重',avatarClass:'jade',tokenColor:'jade',
    location:'太虚山脉·山门',pastLife:'前世为护山灵兽',isDanger:false,
    stats:[{key:'肉身',value:95,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:55,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:40,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:88,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:72,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:50,max:100,cssClass:'stat-fill--jade'}],
  },
  items: [
    {id:'lm-i1',name:'玄铁重剑',grade:'地阶',gradeCls:'card-premium-grade--earth',desc:'以天外陨铁铸造的巨型剑，重达千斤。剑气浑厚，一力降十会。'},
    {id:'lm-i2',name:'护山金刚符',grade:'玄阶',gradeCls:'card-premium-grade--mystic',desc:'可激发一道金刚护盾，持续一刻钟。太虚剑宗外门长老标配。'},
  ],
  abilities: [
    {id:'lm-a1',name:'金刚不坏',desc:'前世护山灵兽的本能神通。激发后肉身防御力倍增，可正面硬抗同阶全力一击。',mastery:78},
    {id:'lm-a2',name:'气壮山河',desc:'以吼声震慑敌人，降低敌方战意和攻击力。在群战中效果显著。',mastery:65},
  ],
  skills: [
    {id:'lm-s1',name:'太虚剑阵·守',grade:'地阶',gradeCls:'card-premium-grade--earth',desc:'太虚剑宗的防御剑阵。率三百弟子坚守山门七日不破的正是此阵。',progress:7,max:9},
    {id:'lm-s2',name:'破山斩',grade:'玄阶',gradeCls:'card-premium-grade--mystic',desc:'将全部力量集中于一点的重斩，可破开山岳。',progress:6,max:9},
  ],
};

/* ---- 楚凌霜 ---- */
const chulingshuangData: CharacterFullData = {
  profile: {
    id:'chulingshuang',name:'楚凌霜',title:'散修·剑道天才',realm:'金丹境·九重',avatarClass:'amethyst',tokenColor:'amethyst',
    location:'钧霄天·天机阁',pastLife:'前世为弑神之刃',isDanger:false,
    stats:[{key:'肉身',value:65,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:75,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:58,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:42,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:80,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:88,max:100,cssClass:'stat-fill--jade'}],
  },
  items: [
    {id:'cl-i1',name:'弑神短刃',grade:'圣阶',gradeCls:'card-premium-grade--saint',desc:'楚凌霜前世的本命武器，曾弑杀过仙神。刃身漆黑如墨，蕴含弑神杀意。'},
    {id:'cl-i2',name:'血煞丹',grade:'地阶',gradeCls:'card-premium-grade--earth',desc:'以敌人精血炼制的丹药，可短时间内大幅提升战斗能力。副作用：药效过后虚弱一日。'},
  ],
  abilities: [
    {id:'cl-a1',name:'弑神杀意',desc:'释放前世的弑神意志，威压敌人神魂。修为低于自身的敌人会直接丧失战斗力。',mastery:60},
    {id:'cl-a2',name:'影遁',desc:'融入阴影中快速移动，可在战斗中瞬间切换位置。极适合偷袭和逃生。',mastery:82},
  ],
  skills: [
    {id:'cl-s1',name:'弑神七式·瞬杀',grade:'圣阶',gradeCls:'card-premium-grade--saint',desc:'弑神刀法第一式。瞬间接近敌人要害，一刀毙命。',progress:5,max:9},
    {id:'cl-s2',name:'影杀术',grade:'天阶',gradeCls:'card-premium-grade--heaven',desc:'配合影遁使用的暗杀术。在阴影中出刀时伤害翻倍。',progress:7,max:9},
    {id:'cl-s3',name:'血影步',grade:'地阶',gradeCls:'card-premium-grade--earth',desc:'以精血催动的步法，速度可突破金丹境极限。',progress:6,max:9},
  ],
};

export const ALL_CHAR_DATA: CharacterFullData[] = [luxingyaoData, limingyuanData, yexilanData, chulingshuangData];

/* ---- Component ---- */
interface Props { characters: CharacterFullData[]; }

export function CharacterInventoryPanel({ characters }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const char = characters[activeIdx];

  return (
    <section className="xianxia-panel" aria-label="轮回者详情">
      <header className="panel-header">
        <h1 className="panel-title"><span className="panel-title-decoration" />轮回者详情</h1>
        <p className="panel-subtitle">每位轮回者的法宝、神通与技能，各有因缘</p>
      </header>

      {/* Character tabs */}
      <div className="char-tabs-nav">
        {characters.map((c, i) => (
          <button key={c.profile.id} id={`char-tab-${c.profile.id}`}
            className={`char-tab-btn${i === activeIdx ? ' char-tab-btn--active' : ''}`}
            onClick={() => setActiveIdx(i)}>
            <span className={`char-tab-dot char-tab-dot--${c.profile.avatarClass}`} />
            {c.profile.name}
            {c.profile.isDanger && <span style={{color:'var(--blood-red-bright)',fontSize:10,marginLeft:2}}>危</span>}
          </button>
        ))}
      </div>

      {/* Current character summary */}
      <div style={{display:'flex',gap:20,alignItems:'center',marginBottom:28,flexWrap:'wrap'}}>
        <div className={`char-card-avatar-premium char-card-avatar--${char.profile.avatarClass}`}
          style={{width:52,height:52,fontSize:22,flexShrink:0}}>{char.profile.name[0]}</div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontFamily:'var(--font-sc)',fontSize:20,fontWeight:700,color:'var(--text-primary)',letterSpacing:'0.05em'}}>{char.profile.name}</div>
          <div style={{fontSize:12,color:'var(--text-dim)',marginTop:2}}>{char.profile.title} · {char.profile.realm}</div>
          <div style={{fontSize:11,color:'var(--text-muted)',marginTop:2,fontStyle:'italic'}}>{char.profile.pastLife}</div>
        </div>
      </div>

      {/* Items: 须弥纳戒 */}
      <div className="char-section-title">须弥纳戒 · 随身法宝</div>
      {char.items.length === 0 ? (
        <div className="empty-state-premium"><div className="empty-state-premium-text">纳戒空空</div><div className="empty-state-premium-desc">此角色尚未获得任何法宝</div></div>
      ) : (
        <div className="char-mini-grid">
          {char.items.map(it => (
            <div key={it.id} className="char-mini-card">
              <div className="char-mini-card-name">{it.name}</div>
              <div className="char-mini-card-desc">{it.desc}</div>
              <span className={`char-mini-card-grade card-premium-grade ${it.gradeCls}`}>{it.grade}</span>
            </div>
          ))}
        </div>
      )}

      {/* Abilities: 本命神通 */}
      <div className="char-section-title">本命神通</div>
      {char.abilities.length === 0 ? (
        <div className="empty-state-premium"><div className="empty-state-premium-text">尚未觉醒</div><div className="empty-state-premium-desc">轮回记忆尚未苏醒，神通仍在沉睡之中</div></div>
      ) : (
        <div className="char-mini-grid">
          {char.abilities.map(ab => (
            <div key={ab.id} className="char-mini-card">
              <div className="char-mini-card-name">{ab.name}</div>
              <div className="char-mini-card-desc">{ab.desc}</div>
              <div style={{marginTop:8,display:'flex',alignItems:'center',gap:8}}>
                <div className="stat-track-premium" style={{flex:1}}><div className="stat-fill-premium stat-fill--gold" style={{width:`${ab.mastery}%`}} /></div>
                <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-dim)'}}>{ab.mastery}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills: 修炼功法 */}
      <div className="char-section-title">修炼功法</div>
      {char.skills.length === 0 ? (
        <div className="empty-state-premium"><div className="empty-state-premium-text">无修炼功法</div><div className="empty-state-premium-desc">尚未习得任何功法，需寻访师门或探索遗迹</div></div>
      ) : (
        <div className="char-mini-grid">
          {char.skills.map(sk => (
            <div key={sk.id} className="char-mini-card">
              <div className="char-mini-card-name">{sk.name}</div>
              <div className="char-mini-card-desc">{sk.desc}</div>
              <span className={`char-mini-card-grade card-premium-grade ${sk.gradeCls}`}>{sk.grade}</span>
              <div style={{marginTop:8,display:'flex',alignItems:'center',gap:8}}>
                <div className="stat-track-premium" style={{flex:1}}><div className="stat-fill-premium stat-fill--amethyst" style={{width:`${Math.round(sk.progress/sk.max*100)}%`}} /></div>
                <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-dim)'}}>{sk.progress}/{sk.max}重</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
