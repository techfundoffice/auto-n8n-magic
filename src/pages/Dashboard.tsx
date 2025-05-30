import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Zap, Settings, Activity, Star, Github, Download, Play, Plus, Sparkles, FileText, Image } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { useUserWorkflows } from "@/hooks/useUserWorkflows";
import UserMenu from '@/components/UserMenu';
import CreateWorkflowModal from '@/components/CreateWorkflowModal';
import Chatbot from '@/components/Chatbot';

// Prebuilt workflows data
const prebuiltWorkflows = [
  {
    id: 1,
    name: "RSS to Social Media",
    description: "Automatically post new RSS feed items to Twitter and LinkedIn",
    category: "Content",
    complexity: "Beginner",
    estimatedTime: "5 min",
    stars: 142,
    tags: ["RSS", "Twitter", "LinkedIn", "Social Media"],
    githubUrl: "https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes/RssFeedRead"
  },
  {
    id: 2,
    name: "Slack to Notion",
    description: "Save important Slack messages to a Notion database",
    category: "Productivity",
    complexity: "Intermediate",
    estimatedTime: "10 min",
    stars: 89,
    tags: ["Slack", "Notion", "Database", "Automation"],
    githubUrl: "https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes/Slack"
  },
  {
    id: 3,
    name: "GitHub Issue Tracker",
    description: "Monitor GitHub issues and send alerts to your team",
    category: "Development",
    complexity: "Advanced",
    estimatedTime: "15 min",
    stars: 234,
    tags: ["GitHub", "Issues", "Monitoring", "Alerts"],
    githubUrl: "https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes/Github"
  },
  {
    id: 4,
    name: "Email to CRM",
    description: "Automatically add new email contacts to your CRM system",
    category: "Sales",
    complexity: "Intermediate",
    estimatedTime: "8 min",
    stars: 67,
    tags: ["Email", "CRM", "Contacts", "Sales"],
    githubUrl: "https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes/EmailReadImap"
  },
  {
    id: 5,
    name: "Website Monitor",
    description: "Monitor website uptime and send notifications on downtime",
    category: "Monitoring",
    complexity: "Beginner",
    estimatedTime: "5 min",
    stars: 156,
    tags: ["Monitoring", "Uptime", "Notifications", "HTTP"],
    githubUrl: "https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes/HttpRequest"
  },
  {
    id: 6,
    name: "Data Backup Automation",
    description: "Backup your important data to multiple cloud storage services",
    category: "Backup",
    complexity: "Advanced",
    estimatedTime: "20 min",
    stars: 98,
    tags: ["Backup", "Cloud Storage", "Automation", "Data"],
    githubUrl: "https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes/GoogleDrive"
  }
];

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { toast } = useToast();
  const { credits, loading: creditsLoading, deductCredits, hasCredits } = useCredits();
  const { workflows, loading: workflowsLoading, refetch: refetchWorkflows } = useUserWorkflows();

  // Generate recent activity from user workflows and static data
  const recentActivity = [
    ...workflows.slice(0, 3).map(workflow => ({
      id: `workflow-${workflow.id}`,
      action: "Created",
      workflow: workflow.name,
      time: new Date(workflow.created_at).toLocaleDateString(),
      status: "success"
    })),
    { id: 1, action: "Deployed", workflow: "Twitter to Notion", time: "2 hours ago", status: "success" },
    { id: 2, action: "Generated", workflow: "Custom API Workflow", time: "1 day ago", status: "success" },
    { id: 3, action: "Fixed", workflow: "RSS to Slack", time: "3 days ago", status: "success" }
  ].slice(0, 6);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been selected for processing.`,
      });
    }
  };

  const handleGenerateFromPrompt = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe what you want your workflow to do.",
        variant: "destructive",
      });
      return;
    }

    if (!hasCredits(15)) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 15 credits to generate a workflow from a description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Deduct credits first
      const success = await deductCredits(15);
      if (!success) {
        setIsGenerating(false);
        return;
      }

      // Simulate AI generation - in real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Workflow generated successfully!",
        description: "Your AI-generated workflow is ready for review and deployment.",
      });
      
      // Reset form
      setAiPrompt('');
      refetchWorkflows();
      
    } catch (error) {
      console.error('Error generating workflow:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceWorkflow = async () => {
    if (!selectedFile || !workflowName) {
      toast({
        title: "Missing information",
        description: "Please upload a file and provide a workflow name.",
        variant: "destructive",
      });
      return;
    }

    if (!hasCredits(10)) {
      return; // Credit check already shows toast
    }

    setIsGenerating(true);
    
    // Deduct credits first
    const success = await deductCredits(10);
    if (!success) {
      setIsGenerating(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Workflow enhanced successfully!",
        description: "Your workflow has been optimized and is ready for deployment.",
      });
    }, 3000);
  };

  const handleDeployTemplate = async (workflow: any) => {
    if (!hasCredits(10)) {
      return; // Credit check already shows toast
    }

    // Deduct credits first
    const success = await deductCredits(10);
    if (!success) {
      return;
    }

    toast({
      title: "Deploying workflow",
      description: `${workflow.name} is being deployed to your n8n instance.`,
    });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Advanced':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AutoN8n</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                💳 {creditsLoading ? '...' : credits.toLocaleString()} credits
              </Badge>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isChatbotOpen ? 'lg:mr-96' : ''}`}>
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Generate, enhance, and deploy your n8n workflows with AI</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            disabled={!hasCredits(10)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="enhance" className="data-[state=active]:bg-blue-600">
              <Upload className="w-4 h-4 mr-2" />
              Enhance Workflow
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-blue-600">
              <Github className="w-4 h-4 mr-2" />
              Workflow Library
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* AI Generator Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Workflow Generator
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Describe your automation needs and let AI create a complete n8n workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ai-prompt" className="text-gray-300">Describe Your Workflow</Label>
                      <Textarea
                        id="ai-prompt"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="bg-gray-900/50 border-gray-600 text-white min-h-[120px]"
                        placeholder="Example: I want to automatically send a Slack message whenever a new GitHub issue is created in my repository, and also log it to a Google Sheet with the issue details..."
                        rows={5}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleGenerateFromPrompt}
                      disabled={isGenerating || !aiPrompt.trim() || !hasCredits(15)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Workflow (15 credits)
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      AI Capabilities
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li>• Generate complete workflows from natural language</li>
                      <li>• Suggest optimal node configurations</li>
                      <li>• Add error handling and retry logic</li>
                      <li>• Include data transformation and validation</li>
                      <li>• Set up proper authentication flows</li>
                      <li>• Optimize for performance and reliability</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-white font-medium mb-3">Example Prompts</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Monitor RSS feeds and post new articles to Twitter",
                      "Backup Notion database to Google Drive daily",
                      "Send email alerts when website is down",
                      "Sync Airtable records with Salesforce"
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setAiPrompt(example)}
                        className="text-left p-3 bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhance Workflow Tab */}
          <TabsContent value="enhance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Workflow
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload JSON files or images of your n8n workflows for AI enhancement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="workflow-name" className="text-gray-300">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                      placeholder="My Awesome Workflow"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workflow-description" className="text-gray-300">Description (Optional)</Label>
                    <Textarea
                      id="workflow-description"
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                      placeholder="Describe what this workflow does..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="file-upload" className="text-gray-300">Upload File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      accept=".json,.png,.jpg,.jpeg"
                      className="bg-gray-900/50 border-gray-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                    />
                    {selectedFile && (
                      <div className="flex items-center mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                        {selectedFile.type.startsWith('image/') ? (
                          <Image className="w-4 h-4 text-blue-400 mr-2" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-400 mr-2" />
                        )}
                        <span className="text-sm text-blue-400">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhancement Section */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    AI Enhancement
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Let AI optimize and enhance your workflow (10 credits)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-medium mb-2">Enhancement Features:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Fix broken or incomplete workflows</li>
                      <li>• Optimize performance and reliability</li>
                      <li>• Add comprehensive error handling</li>
                      <li>• Improve data transformation logic</li>
                      <li>• Add logging and monitoring</li>
                      <li>• Security and authentication improvements</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={handleEnhanceWorkflow}
                    disabled={isGenerating || !selectedFile || !workflowName || !hasCredits(10)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Enhance & Deploy (10 credits)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Workflow Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Prebuilt Workflow Library</h2>
                <p className="text-gray-400">Ready-to-deploy workflows from the community</p>
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Github className="w-4 h-4 mr-2" />
                Browse on GitHub
              </Button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {prebuiltWorkflows.map((workflow) => (
                <Card key={workflow.id} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl hover:bg-gray-800/70 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {workflow.category}
                      </Badge>
                      <div className="flex items-center text-gray-400">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{workflow.stars}</span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-blue-400 transition-colors">
                      {workflow.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {workflow.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <Badge className={getComplexityColor(workflow.complexity)}>
                        {workflow.complexity}
                      </Badge>
                      <span className="text-gray-400">{workflow.estimatedTime}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDeployTemplate(workflow)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                        size="sm"
                        disabled={!hasCredits(10)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Deploy (10 credits)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        onClick={() => window.open(workflow.githubUrl, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your latest workflow actions and deployments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workflowsLoading ? (
                  <div className="text-center text-gray-400 py-8">Loading recent activity...</div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">
                              {activity.action} "{activity.workflow}"
                            </p>
                            <p className="text-sm text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No recent activity. Create your first workflow to get started!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CreateWorkflowModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onWorkflowCreated={refetchWorkflows}
      />

      <Chatbot 
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
      />
    </div>
  );
};

export default Dashboard;
