import React, { useState, useEffect } from 'react';
import { Camera, Ruler, Anchor, Fish, X, Check } from 'lucide-react';
import { CatchRecord, getCatchRecords, addCatchRecord, deleteCatchRecord } from '@/services/storage';
import './CatchLog.scss';

interface CatchLogProps {
  location?: { lng: number; lat: number; name?: string };
  isOpen: boolean;
  onClose: () => void;
}

const SPECIES_OPTIONS = [
  '黑鱼', '鲈鱼', '翘嘴', '鳜鱼', '鲶鱼', '青鱼', '草鱼', '鲤鱼', '鲫鱼', '其他'
];

const LURE_OPTIONS = [
  '米诺', '波爬', '铅笔', '卷尾蛆', '小亮片', 'VIB', '复合亮片', '包铅鱼', '其他'
];

const CatchLog: React.FC<CatchLogProps> = ({ location, isOpen, onClose }) => {
  const [records, setRecords] = useState<CatchRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    species: '',
    length: '',
    weight: '',
    lure: '',
    notes: ''
  });

  useEffect(() => {
    setRecords(getCatchRecords());
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.species) return;

    addCatchRecord({
      spotName: location?.name || '未知钓点',
      lng: location?.lng || 0,
      lat: location?.lat || 0,
      species: formData.species,
      length: formData.length ? parseFloat(formData.length) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      lure: formData.lure || undefined,
      notes: formData.notes || undefined,
    });

    setRecords(getCatchRecords());
    setShowForm(false);
    setFormData({ species: '', length: '', weight: '', lure: '', notes: '' });
  };

  const handleDelete = (id: string) => {
    deleteCatchRecord(id);
    setRecords(getCatchRecords());
  };

  if (!isOpen) return null;

  return (
    <div className="catch-log-overlay" onClick={onClose}>
      <div className="catch-log" onClick={e => e.stopPropagation()}>
        <div className="catch-log__header">
          <h3>📓 钓获记录</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!showForm ? (
          <>
            <button className="add-btn" onClick={() => setShowForm(true)}>
              <Fish size={18} />
              <span>记录渔获</span>
            </button>

            <div className="catch-list">
              {records.length === 0 ? (
                <div className="empty-state">
                  <Fish size={40} />
                  <p>暂无记录</p>
                  <span>记录你的第一条鱼吧！</span>
                </div>
              ) : (
                records.map(record => (
                  <div key={record.id} className="catch-item">
                    <div className="catch-info">
                      <span className="catch-species">{record.species}</span>
                      <span className="catch-spot">📍 {record.spotName}</span>
                      <div className="catch-details">
                        {record.length && <span>📏 {record.length}cm</span>}
                        {record.weight && <span>⚖️ {record.weight}kg</span>}
                        {record.lure && <span>🎣 {record.lure}</span>}
                      </div>
                      <span className="catch-time">
                        {new Date(record.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(record.id)}>
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="catch-form">
            <div className="form-group">
              <label>🐟 鱼种 *</label>
              <select 
                value={formData.species}
                onChange={e => setFormData({...formData, species: e.target.value})}
              >
                <option value="">选择鱼种</option>
                {SPECIES_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Ruler size={14} /> 长度 (cm)</label>
                <input 
                  type="number" 
                  placeholder="可选"
                  value={formData.length}
                  onChange={e => setFormData({...formData, length: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label><Anchor size={14} /> 重量 (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="可选"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>🎣 使用拟饵</label>
              <select 
                value={formData.lure}
                onChange={e => setFormData({...formData, lure: e.target.value})}
              >
                <option value="">选择拟饵</option>
                {LURE_OPTIONS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>📝 备注</label>
              <textarea 
                placeholder="可选备注..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowForm(false)}>取消</button>
              <button className="submit-btn" onClick={handleSubmit}>
                <Check size={16} /> 保存
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatchLog;
