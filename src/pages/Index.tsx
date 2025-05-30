
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Upload, Zap, Settings, Star, Github, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload & Generate",
      description: "Upload JSON files or images of n8n workflows and let AI enhance them"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Auto Deploy",
      description: "Automatically deploy generated workflows to your n8n instance"
    },
    {
      icon: <Github className="w-6 h-6" />,
      title: "Prebuilt Library",
      description: "Access curated workflows from GitHub ready for instant deployment"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Smart Repair",
      description: "AI-powered workflow fixing and optimization"
    }
  ];

  const prebuiltWorkflows = [
    {
      name: "Twitter to Notion",
      description: "Posts tweets to Notion database",
      stars: 245,
      category: "Social Media"
    },
    {
      name: "RSS to Slack",
      description: "Sends RSS feed items to Slack",
      stars: 189,
      category: "Communication"
    },
    {
      name: "GitHub Issues Tracker",
      description: "Notifies when new GitHub issues are created",
      stars: 156,
      category: "Development"
    },
    {
      name: "Stripe Payment Logger",
      description: "Logs successful payments to Google Sheets",
      stars: 203,
      category: "Finance"
    }
  ];

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
              <Link to="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
              🚀 AI-Powered Workflow Automation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Generate <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">n8n Workflows</span>
              <br />with AI Magic
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload images or JSON files, let our AI enhance and fix your workflows, then deploy them instantly to your n8n instance. Access our curated library of proven automation templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                  Start Building <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                <Eye className="mr-2 w-5 h-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-400">Powerful features to supercharge your automation workflow</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Prebuilt Workflows Preview */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Prebuilt Workflow Library</h2>
          <p className="text-xl text-gray-400">Ready-to-deploy workflows from the community</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {prebuiltWorkflows.map((workflow, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl hover:bg-gray-800/70 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {workflow.category}
                  </Badge>
                  <div className="flex items-center text-gray-400">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">{workflow.stars}</span>
                  </div>
                </div>
                <CardTitle className="text-white text-lg group-hover:text-blue-400 transition-colors">
                  {workflow.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 mb-4">{workflow.description}</CardDescription>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full">
                  <Github className="w-4 h-4 mr-2" />
                  View Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/library">
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              View All Templates <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 backdrop-blur-xl">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Automate?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of developers who are already using AutoN8n to streamline their workflows
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                  Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 backdrop-blur-xl bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AutoN8n</span>
            </div>
            <p className="text-gray-400">© 2024 AutoN8n. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
