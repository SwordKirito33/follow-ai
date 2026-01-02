import React from 'react';
import { Calendar, Zap, DollarSign } from 'lucide-react';
import { TaskFormData } from './TaskTypeSelector';
import Badge from './ui/Badge';

interface TaskPreviewProps {
  formData: TaskFormData;
  userLevel: number;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ formData, userLevel }) => {
  const canPost = formData.taskType === 'xp' || 
    (formData.taskType === 'paid' && 
     ((formData.paymentAmount || 0) < 50 && userLevel >= 5) ||
     ((formData.paymentAmount || 0) >= 50 && (formData.paymentAmount || 0) < 200 && userLevel >= 10) ||
     ((formData.paymentAmount || 0) >= 200 && userLevel >= 15));

  return (
    <div className="glass-card rounded-xl shadow-xl p-6 sticky top-8">
      <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Task Preview</h2>

      {!formData.title ? (
        <div className="text-center py-12 text-gray-400">
          <p>Start filling the form to see preview</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {formData.taskType === 'xp' ? (
                <Badge variant="success" size="sm">
                  <Zap size={12} className="mr-1" />
                  XP Task
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  <DollarSign size={12} className="mr-1" />
                  Paid Task
                </Badge>
              )}
              <Badge variant="secondary" size="sm">Open</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{formData.title}</h3>
          </div>

          {/* Description */}
          {formData.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
              <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                {formData.description}
              </div>
            </div>
          )}

          {/* Requirements */}
          {formData.requirements && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Requirements</h4>
              <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                {formData.requirements}
              </div>
            </div>
          )}

          {/* Reward */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Reward</div>
            <div className="text-2xl font-bold text-blue-600">
              {formData.taskType === 'xp' ? (
                <>+{formData.xpReward || 0} XP</>
              ) : (
                <>${(formData.paymentAmount || 0).toFixed(2)} USD</>
              )}
            </div>
          </div>

          {/* Level Requirement */}
          {formData.taskType === 'paid' && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-gray-600 mb-1">Minimum Level Required</div>
              <div className="text-lg font-bold text-yellow-700">
                Level {formData.paymentAmount && formData.paymentAmount < 50 ? 5 :
                      formData.paymentAmount && formData.paymentAmount < 200 ? 10 : 15}
              </div>
              {!canPost && (
                <div className="text-xs text-red-600 mt-2">
                  ⚠️ You need Level {formData.paymentAmount && formData.paymentAmount < 50 ? 5 :
                                    formData.paymentAmount && formData.paymentAmount < 200 ? 10 : 15} to post this task
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Posted now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPreview;

