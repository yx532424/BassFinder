import React, { useState } from 'react';
import { getCatches, addCatch, deleteCatch, FISH_TYPES, CatchRecord } from '@/services/catches';
import './CatchModal.scss';

interface CatchModalProps {
  visible: boolean;
  onClose: () => void;
}

const CatchModal: React.FC<CatchModalProps> = ({ visible, onClose }) => {
  const [catches, setCatches] = useState<CatchRecord[]>(getCatches());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatch, setNewCatch] = useState({
    fishType: 'bass',
    weight: '',
    length: '',
    location: '',
    description: '',
    rating: 3,
  });

  if (!visible) return null;

  const handleAddCatch = () => {
    if (!newCatch.fishType) return;
    
    const record = addCatch({
      fishType: newCatch.fishType,
      weight: newCatch.weight ? parseFloat(newCatch.weight) : undefined,
      length: newCatch.length ? parseFloat(newCatch.length) : undefined,
      location: newCatch.location || '未知地点',
      lng: 120.3014,
      lat: 31.5747,
      description: newCatch.description,
      rating: newCatch.rating,
    });
    
    setCatches([record, ...catches]);
    setShowAddForm(false);
    setNewCatch({
      fishType: 'bass',
      weight: '',
      length: '',
      location: '',
      description: '',
      rating: 3,
    });
  };

  const handleDeleteCatch = (id: string) => {
    deleteCatch(id);
    setCatches(catches.filter(c => c.id !== id));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="catch-modal-overlay" onClick={onClose}>
      <div className="catch-modal" onClick={e => e.stopPropagation()}>
        <div className="catch-header">
          <h2>🎣 钓获记录</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="catch-actions">
          <button className="add-catch-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '取消' : '+ 记录钓获'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-catch-form">
            <select
              value={newCatch.fishType}
              onChange={e => setNewCatch({ ...newCatch, fishType: e.target.value })}
            >
              {FISH_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
              ))}
            </select>
            <div className="form-row">
              <input
                type="number"
                placeholder="重量(斤)"
                value={newCatch.weight}
                onChange={e => setNewCatch({ ...newCatch, weight: e.target.value })}
              />
              <input
                type="number"
                placeholder="长度(cm)"
                value={newCatch.length}
                onChange={e => setNewCatch({ ...newCatch, length: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="钓点名称"
              value={newCatch.location}
              onChange={e => setNewCatch({ ...newCatch, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="备注(可选)"
              value={newCatch.description}
              onChange={e => setNewCatch({ ...newCatch, description: e.target.value })}
            />
            <div className="rating-select">
              <span>评分:</span>
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  className={`star ${n <= newCatch.rating ? 'active' : ''}`}
                  onClick={() => setNewCatch({ ...newCatch, rating: n })}
                >
                  ⭐
                </button>
              ))}
            </div>
            <button className="save-btn" onClick={handleAddCatch}>保存记录</button>
          </div>
        )}

        <div className="catch-list">
          {catches.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎣</span>
              <p>暂无钓获记录</p>
              <p className="empty-hint">记录你的第一条鱼吧！</p>
            </div>
          ) : (
            catches.map(catchItem => (
              <div key={catchItem.id} className="catch-item">
                <div className="catch-emoji">
                  {FISH_TYPES.find(t => t.value === catchItem.fishType)?.emoji || '🐟'}
                </div>
                <div className="catch-info">
                  <div className="catch-header-row">
                    <span className="fish-type">
                      {FISH_TYPES.find(t => t.value === catchItem.fishType)?.label}
                    </span>
                    <div className="catch-rating">
                      {[1,2,3,4,5].map(n => (
                        <span key={n} className={n <= catchItem.rating ? 'active' : ''}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="catch-details">
                    {catchItem.weight && <span>🐔 {catchItem.weight}斤</span>}
                    {catchItem.length && <span>📏 {catchItem.length}cm</span>}
                  </div>
                  <div className="catch-meta">
                    <span>📍 {catchItem.location}</span>
                    <span>🕐 {formatDate(catchItem.timestamp)}</span>
                  </div>
                  {catchItem.description && (
                    <div className="catch-desc">{catchItem.description}</div>
                  )}
                </div>
                <button className="delete-btn" onClick={() => handleDeleteCatch(catchItem.id)}>🗑️</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CatchModal;
