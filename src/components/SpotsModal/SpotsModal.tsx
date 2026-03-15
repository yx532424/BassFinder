import React, { useState } from 'react';
import { getSpots, addSpot, deleteSpot, FishSpot } from '@/services/spots';
import './SpotsModal.scss';

interface SpotsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSpot?: (spot: FishSpot) => void;
}

const SPOT_TYPES = [
  { value: 'lake', label: '湖泊', emoji: '🌊' },
  { value: 'river', label: '江河', emoji: '🌊' },
  { value: 'pond', label: '池塘', emoji: '🏊' },
  { value: 'reservoir', label: '水库', emoji: '🏔️' },
  { value: 'sea', label: '海洋', emoji: '⚓' },
  { value: 'other', label: '其他', emoji: '📍' },
];

const SpotsModal: React.FC<SpotsModalProps> = ({ visible, onClose, onSelectSpot }) => {
  const [spots, setSpots] = useState<FishSpot[]>(getSpots());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: '',
    type: 'lake' as FishSpot['type'],
    description: '',
    rating: 3,
  });

  if (!visible) return null;

  const handleAddSpot = () => {
    if (!newSpot.name.trim()) return;
    
    // 获取当前位置作为默认
    const currentLng = 120.3014; // 默认无锡
    const currentLat = 31.5747;
    
    const spot = addSpot({
      ...newSpot,
      lng: currentLng,
      lat: currentLat,
    });
    
    setSpots([...spots, spot]);
    setShowAddForm(false);
    setNewSpot({ name: '', type: 'lake', description: '', rating: 3 });
  };

  const handleDeleteSpot = (id: string) => {
    deleteSpot(id);
    setSpots(spots.filter(s => s.id !== id));
  };

  const handleSelectSpot = (spot: FishSpot) => {
    if (onSelectSpot) {
      onSelectSpot(spot);
    }
    onClose();
  };

  return (
    <div className="spots-modal-overlay" onClick={onClose}>
      <div className="spots-modal" onClick={e => e.stopPropagation()}>
        <div className="spots-header">
          <h2>📍 我的钓点</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="spots-actions">
          <button className="add-spot-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '取消' : '+ 添加钓点'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-spot-form">
            <input
              type="text"
              placeholder="钓点名称"
              value={newSpot.name}
              onChange={e => setNewSpot({ ...newSpot, name: e.target.value })}
            />
            <select
              value={newSpot.type}
              onChange={e => setNewSpot({ ...newSpot, type: e.target.value as FishSpot['type'] })}
            >
              {SPOT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
              ))}
            </select>
            <div className="rating-select">
              <span>评分:</span>
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  className={`star ${n <= newSpot.rating ? 'active' : ''}`}
                  onClick={() => setNewSpot({ ...newSpot, rating: n })}
                >
                  ⭐
                </button>
              ))}
            </div>
            <button className="save-btn" onClick={handleAddSpot}>保存</button>
          </div>
        )}

        <div className="spots-list">
          {spots.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎣</span>
              <p>暂无钓点记录</p>
              <p className="empty-hint">点击"添加钓点"保存你的专属位置</p>
            </div>
          ) : (
            spots.map(spot => (
              <div key={spot.id} className="spot-item">
                <div className="spot-info" onClick={() => handleSelectSpot(spot)}>
                  <div className="spot-header">
                    <span className="spot-type">{SPOT_TYPES.find(t => t.value === spot.type)?.emoji}</span>
                    <span className="spot-name">{spot.name}</span>
                    <div className="spot-rating">
                      {[1,2,3,4,5].map(n => (
                        <span key={n} className={n <= spot.rating ? 'active' : ''}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="spot-meta">
                    <span>访问 {spot.visitedCount} 次</span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteSpot(spot.id)}>🗑️</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotsModal;
