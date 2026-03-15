/**
 * 排行榜服务
 * 本地排行榜模拟（后续可对接后端）
 */

const RANKING_KEY = 'bass_finder_ranking';
const MAX_RANKING = 20;

interface RankingItem {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  level: string;
  location: string;
  timestamp: number;
}

// 获取排行榜
export const getRanking = (): RankingItem[] => {
  try {
    const data = localStorage.getItem(RANKING_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('获取排行榜失败:', e);
  }
  
  // 返回默认模拟数据
  return getDefaultRanking();
};

// 默认模拟数据
const getDefaultRanking = (): RankingItem[] => {
  const avatars = ['🎣', '🐟', '🦈', '🐠', '🐡', '🦞', '🦀', '🐙', '🐬', '🐳'];
  const levels = ['极佳', '优秀', '良好', '一般'];
  const locations = ['千岛湖', '太湖', '鄱阳湖', '水库A', '水库B', '江河', '溪流', '池塘'];
  
  const names = ['路亚老王', '钓鱼小李', '钓神张三', '渔夫老陈', '水域达人', 
                 '新手小白', '老钓手', '渔获满满', '钓鱼侠', '水中蛟龙'];
  
  return names.map((nickname, index) => ({
    id: `default_${index}`,
    nickname,
    avatar: avatars[index % avatars.length],
    score: 95 - index * 5 - Math.floor(Math.random() * 5),
    level: levels[Math.min(Math.floor(index / 3), levels.length - 1)],
    location: locations[index % locations.length],
    timestamp: Date.now() - index * 3600000
  }));
};

// 更新自己的排名
export const updateMyRanking = (score: number, level: string, location: string): void => {
  try {
    const nickname = localStorage.getItem('bass_finder_nickname') || '我';
    const myItem: RankingItem = {
      id: 'me',
      nickname,
      avatar: '🎯',
      score,
      level,
      location,
      timestamp: Date.now()
    };
    
    let ranking = getRanking();
    
    // 查找并删除自己的旧记录
    ranking = ranking.filter(r => r.id !== 'me');
    
    // 添加新记录
    ranking.unshift(myItem);
    
    // 排序并限制数量
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, MAX_RANKING);
    
    localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
  } catch (e) {
    console.warn('更新排行榜失败:', e);
  }
};

// 获取自己的排名
export const getMyRank = (): number => {
  const ranking = getRanking();
  const myIndex = ranking.findIndex(r => r.id === 'me');
  return myIndex === -1 ? -1 : myIndex + 1;
};

// 获取排名数据（带前三名突出显示）
export const getRankingWithHighlight = (): {
  top3: RankingItem[];
  rest: RankingItem[];
  myRank: number;
} => {
  const ranking = getRanking();
  const myRank = getMyRank();
  
  return {
    top3: ranking.slice(0, 3),
    rest: ranking.slice(3),
    myRank
  };
};
