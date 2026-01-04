import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Zap,
  TrendingUp,
  Wand2,
  RefreshCw,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import FollowButton from '@/components/ui/follow-button';
import Badge from '@/components/ui/Badge';

interface ToolStats {
  id: string;
  name: string;
  tagline: string | null;
  website_url: string | null;
  logo_url: string | null;
  task_count: number;
  beginner_count: number;
  intermediate_count: number;
  advanced_count: number;
  created_at: string;
}

interface ProgressState {
  current: number;
  total: number;
  currentTool: string | null;
}

const Dashboard: React.FC = () => {
  const toast = useToast();
  const [tools, setTools] = useState<ToolStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingToolId, setGeneratingToolId] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({ current: 0, total: 0, currentTool: null });
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const cancelBatchRef = useRef(false);

  // Fetch tools data
  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_tools_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tools:', error);
        toast.error('Failed to load tools', error.message);
        return;
      }

      setTools(data || []);
    } catch (err) {
      console.error('Failed to fetch tools:', err);
      toast.error('Failed to load tools', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // Generate tasks for a single tool
  const generateTasks = async (toolId: string, toolName: string): Promise<boolean> => {
    try {
      // Get current authenticated user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast.error('Authentication required', 'Please log in to generate tasks');
        return false;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/task-generator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ tool_id: toolId }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Generated tasks for ${toolName}`, `${result.tasks_generated || 3} tasks created`);
        await fetchTools(); // Refresh data
        return true;
      } else {
        toast.error(`Failed to generate tasks for ${toolName}`, result.error || 'Unknown error');
        return false;
      }
    } catch (err) {
      console.error('Network error:', err);
      toast.error('Network error', err instanceof Error ? err.message : 'Failed to connect');
      return false;
    }
  };

  // Handle single tool generation
  const handleGenerateTasks = async (toolId: string, toolName: string) => {
    if (generatingToolId) return; // Prevent concurrent generation

    setGeneratingToolId(toolId);
    try {
      await generateTasks(toolId, toolName);
    } finally {
      setGeneratingToolId(null);
    }
  };

  // Batch generate all missing tasks
  const handleGenerateAllMissing = async () => {
    const emptyTools = tools.filter(t => t.task_count === 0);
    
    if (emptyTools.length === 0) {
      toast.info('All tools already have tasks', 'No action needed');
      return;
    }

    if (isBatchGenerating) return;

    // ✅ Reset cancel flag
    cancelBatchRef.current = false;
    setIsBatchGenerating(true);
    setShowProgressModal(true);
    setProgress({ current: 0, total: emptyTools.length, currentTool: null });

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < emptyTools.length; i++) {
        // ✅ Check cancel at start of loop
        if (cancelBatchRef.current) break;

        const tool = emptyTools[i];
        setProgress({ current: i + 1, total: emptyTools.length, currentTool: tool.name });

        const success = await generateTasks(tool.id, tool.name);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }

        // Rate limit with cancel check
        if (i < emptyTools.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          // ✅ Check cancel after sleep
          if (cancelBatchRef.current) break;
        }
      }
    } finally {
      // ✅ ALWAYS cleanup, even if cancelled or error
      setShowProgressModal(false);
      setIsBatchGenerating(false);
      setProgress({ current: 0, total: 0, currentTool: null });
    }

    // ✅ Show appropriate message
    if (cancelBatchRef.current) {
      toast.info('Batch generation cancelled', `Processed: ${successCount + failCount} tools`);
    } else {
      toast.success('Batch generation complete', `Success: ${successCount}, Failed: ${failCount}`);
    }

    await fetchTools(); // Final refresh
  };

  // Add cancel handler
  const handleCancelBatch = () => {
    cancelBatchRef.current = true;
    setShowProgressModal(false); // Close Modal immediately for better UX
  };

  // Calculate statistics
  const totalTools = tools.length;
  const totalTasks = tools.reduce((sum, t) => sum + t.task_count, 0);
  const avgTasksPerTool = totalTools > 0 ? (totalTasks / totalTools).toFixed(1) : '0';

  // Get status badge for a tool
  const getStatusBadge = (tool: ToolStats) => {
    if (tool.task_count === 3) {
      return <Badge variant="success" size="sm">✓ Complete</Badge>;
    } else if (tool.task_count === 0) {
      return <Badge variant="danger" size="sm">⚠ No Tasks</Badge>;
    } else {
      return <Badge variant="warning" size="sm">⚡ Partial</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4 tracking-tight">
            Admin Command Center
          </h1>
          <p className="text-xl text-gray-400 font-medium">Manage AI tools and generate tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 animate-slideUp">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-blue/20 rounded-lg">
                <Briefcase className="h-6 w-6 text-primary-cyan" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Tools</p>
                <p className="text-2xl font-bold text-white">{totalTools}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-purple/20 rounded-lg">
                <Zap className="h-6 w-6 text-primary-purple" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-green/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent-green" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg Tasks/Tool</p>
                <p className="text-2xl font-bold text-white">{avgTasksPerTool}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <FollowButton
            onClick={handleGenerateAllMissing}
            variant="primary"
            size="lg"
            icon={Wand2}
            iconPosition="left"
            disabled={isBatchGenerating || generatingToolId !== null}
            isLoading={isBatchGenerating}
          >
            Generate All Missing Tasks
          </FollowButton>

          <FollowButton
            onClick={fetchTools}
            variant="secondary"
            size="lg"
            icon={RefreshCw}
            iconPosition="left"
            disabled={loading || isBatchGenerating}
            isLoading={loading}
          >
            Refresh Data
          </FollowButton>

          <Link to="/admin/reviews" className="inline-block">
            <FollowButton
              variant="secondary"
              size="lg"
              as="button"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              📋 Review Submissions
            </FollowButton>
          </Link>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => {
            const isGenerating = generatingToolId === tool.id;
            const hasTasks = tool.task_count > 0;

            return (
              <div
                key={tool.id}
                className="glass-card rounded-xl p-6 card-3d hover:shadow-2xl transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Tool Header */}
                <div className="flex items-start gap-4 mb-4">
                  {tool.logo_url ? (
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{tool.name}</h3>
                    {tool.tagline && (
                      <p className="text-sm text-gray-400 line-clamp-2">{tool.tagline}</p>
                    )}
                  </div>
                  {tool.website_url && (
                    <a
                      href={tool.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-primary-cyan transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {getStatusBadge(tool)}
                </div>

                {/* Task Stats */}
                <div className="mb-4 p-3 bg-slate-800/50/5 rounded-lg">
                  <p className="text-sm font-medium text-gray-300 mb-2">Tasks:</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      B: {tool.beginner_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      I: {tool.intermediate_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      A: {tool.advanced_count}
                    </span>
                    <span className="ml-auto font-semibold text-white">
                      Total: {tool.task_count}/3
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <FollowButton
                  onClick={() => handleGenerateTasks(tool.id, tool.name)}
                  variant={hasTasks ? 'secondary' : 'primary'}
                  size="md"
                  icon={hasTasks ? RefreshCw : Wand2}
                  iconPosition="left"
                  disabled={isGenerating || isBatchGenerating || generatingToolId !== null}
                  isLoading={isGenerating}
                  className="w-full"
                >
                  {hasTasks ? 'Regenerate' : 'Generate Tasks'}
                </FollowButton>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {tools.length === 0 && !loading && (
          <div className="glass-card rounded-xl p-12 text-center">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-400 mb-2">No tools found</p>
            <p className="text-sm text-gray-400">Add tools to the database to get started</p>
          </div>
        )}
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-xl p-8 max-w-md w-full animate-scaleIn">
            <div className="text-center mb-6">
              <Loader2 className="h-12 w-12 text-primary-cyan animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Generating Tasks...</h3>
              <p className="text-sm text-gray-400">
                {progress.currentTool && `Currently processing: ${progress.currentTool}`}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="w-full h-2 bg-slate-800/50/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-blue to-primary-purple transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Cancel Button */}
            <FollowButton
              onClick={handleCancelBatch}
              variant="secondary"
              size="md"
              className="w-full"
            >
              Cancel
            </FollowButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

