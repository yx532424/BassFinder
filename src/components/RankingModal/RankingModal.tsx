import React from 'react';
import { getRankingWithHighlight } from '@/services/ranking';
import './RankingModal.scss';

interface RankingModalProps {
  visible: boolean;
  onClose: () => void;
}

const RankingModal: React.FC<RankingModalProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  
  const { top3, rest, myRank } = getRankingWithHighlight();

  return (
    <div className="ranking-modal-overlay" onClick={onClose}>
      <div className="ranking-modal" onClick={e => e.stopPropagation()}>
        <div className="ranking-header">
          <h2>🏆 钓鱼达人榜</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {myRank > 0 && (
          <div className="my-rank-card">
            <span className="my-rank-label">我的排名</span>
            <span className="my-rank-value">第{myRank}名</span>
          </div>
        )}
        
        <div className="ranking-list">
          {top3.map((item, index) => (
            <div key={item.id} className={`ranking-item top-${index + 1}`}>
              <div className="rank-medal">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <div className="user-avatar">{item.avatar}</div>
              <div className="user-info">
                <div className="user-name">{item.nickname}</div>
                <div className="user-location">📍 {item.location}</div>
              </div>
              <div className="user-score">
                <span className="score-value">{item.score}</span>
                <span className="score-label">分</span>
              </div>
            </div>
          ))}
          
          {rest.map((item, index) => (
            <div key={item.id} className="ranking-item">
              <div className="rank-number">{index + 4}</div>
              <div className="user-avatar">{item.avatar}</div>
              <div className="user-info">
                <div className="user-name">{item.nickname}</div>
                <div className="user-location">📍 {item.location}</div>
              </div>
              <div className="user-score">
                <span className="score-value">{item.score}</span>
                <span className="score-label">分</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingModal;
