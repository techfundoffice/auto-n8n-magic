
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Zap, Settings, Activity, Star, Github, Download, Play } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const prebuiltWorkflows = [
    {
      id: 1,
      name: "Twitter to Notion",
      description: "Automatically save tweets to your Notion database with full metadata",
      category: "Social Media",
      stars: 245,
      complexity: "Beginner",
      estimatedTime: "5 min setup",
      tags: ["Twitter", "Notion", "Social Media"],
      githubUrl: "https://github.com/n8n-io/n8n-workflows/blob/master/workflows/Twitter_to_Notion.json"
    },
    {
      id: 2,
      name: "RSS to Slack",
      description: "Monitor RSS feeds and send new items to Slack channels",
      category: "Communication",
      stars: 189,
      complexity: "Beginner",
      estimatedTime: "3 min setup",
      tags: ["RSS", "Slack", "Notifications"],
      githubUrl: "https://github.com/n8n-io/n8n-workflows/blob/master/workflows/RSS_to_Slack.json"
    },
    {
      id: 3,
      name: "GitHub Issues Tracker",
      description: "Get notified when new GitHub issues are created in your repositories",
      category: "Development",
      stars: 156,
      complexity: "Intermediate",
      estimatedTime: "7 min setup",
      tags: ["GitHub", "Issues", "Notifications"],
      githubUrl: "https://github.com/n8n-io/n8n-workflows/blob/master/workflows/GitHub_Issues_Notification.json"
    },
    {
      id: 4,
      name: "YouTube Video Monitor",
      description: "Monitor YouTube channels and get notified of new video uploads",
      category: "Content",
      stars: 178,
      complexity: "Beginner",
      estimatedTime: "4 min setup",
      tags: ["YouTube", "Monitoring", "Content"],
      githubUrl: "https://github.com/n8n-io/n8n-workflows/blob/master/workflows/Youtube_New_Video_Alert.json"
    },
    {
      id: 5,
      name: "Stripe Payment Logger",
      description: "Log successful Stripe payments to Google Sheets for analytics",
      category: "Finance",
      stars: 203,
      complexity: "Intermediate",
      estimatedTime: "8 min setup",
      tags: ["Stripe", "Google Sheets", "Analytics"],
      githubUrl: "https://github.com/n8n-io/n8n-workflows/blob/master/workflows/Stripe_to_Google_Sheets.json"
    },
    {
      id: 6,
      name: "GPT-4 Chatbot",
      description: "Create a powerful chatbot using OpenAI's GPT-4 API",
      category: "AI",
      stars: 312,
      complexity: "Advanced",
      estimatedTime: "12 min setup",
      tags: ["OpenAI", "GPT-4", "Chatbot"],
      githubUrl: "https://github.com/n8n-io/n8n-workflows/blob/master/workflows/OpenAI_Chatbot.json"
    }
  ];

  const recentActivity = [
    { id: 1, action: "Deployed", workflow: "Twitter to Notion", time: "2 hours ago", status: "success" },
    { id: 2, action: "Generated", workflow: "Custom API Workflow", time: "1 day ago", status: "success" },
    { id: 3, action: "Fixed", workflow: "RSS to Slack", time: "3 days ago", status: "success" }
  ];

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

  const handleGenerateWorkflow = async () => {
    if (!selectedFile || !workflowName) {
      toast({
        title: "Missing information",
        description: "Please upload a file and provide a workflow name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Workflow generated successfully!",
        description: "Your workflow has been created and is ready for deployment.",
      });
    }, 3000);
  };

  const handleDeployTemplate = (workflow: any) => {
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
                💳 1,250 credits
              </Badge>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Generate, enhance, and deploy your n8n workflows with AI</p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">
              <Upload className="w-4 h-4 mr-2" />
              Create Workflow
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

          {/* Create Workflow Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Workflow
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload JSON files or images of your n8n workflows
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
                      <p className="text-sm text-blue-400 mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Generate Section */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    AI Generation
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Let AI enhance and deploy your workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-2">What our AI can do:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Fix broken or incomplete workflows</li>
                      <li>• Optimize performance and reliability</li>
                      <li>• Add error handling and logging</li>
                      <li>• Generate workflows from descriptions</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateWorkflow}
                    disabled={isGenerating || !selectedFile || !workflowName}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate & Deploy
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
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Deploy
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
