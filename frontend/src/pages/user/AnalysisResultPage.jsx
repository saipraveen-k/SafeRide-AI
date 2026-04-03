import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CheckCircle, 
  AlertTriangle, 
  Camera, 
  Mic, 
  TrendingUp,
  ArrowLeft,
  HelpCircle,
  Loader2
} from 'lucide-react';

const AnalysisResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { api } = useAuth();
  
  const [analysisData, setAnalysisData] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [locationData, setLocationData] = useState({ address: '' });

  useEffect(() => {
    if (!analysisData) {
      // Fallback: get analysis from localStorage or redirect back
      const savedAnalysis = localStorage.getItem('aiAnalysis');
      if (savedAnalysis) {
        setAnalysisData(JSON.parse(savedAnalysis));
      } else {
        setError('No analysis data found. Please try again.');
        setTimeout(() => navigate('/app/scan'), 3000);
      }
    }
  }, [analysisData, navigate]);

  const getIssueFromAnalysis = () => {
    if (!analysisData) return 'other';
    
    // Prioritize image analysis
    if (analysisData.image && analysisData.image.detected) {
      const issues = analysisData.image.issues;
      if (issues.includes('flat_tire')) return 'tire';
      if (issues.includes('smoke') || issues.includes('leak')) return 'engine';
      if (issues.includes('damage')) return 'accident';
    }
    
    // Check audio analysis
    if (analysisData.audio && analysisData.audio.detected) {
      const status = analysisData.audio.engineStatus;
      if (status === 'misfire') return 'engine';
      if (status === 'battery_issue') return 'battery';
    }
    
    return 'other';
  };

  const getConfidence = () => {
    if (!analysisData) return 0;
    
    const imageConf = analysisData.image?.confidence || 0;
    const audioConf = analysisData.audio?.confidence || 0;
    
    // Return the higher confidence
    return Math.max(imageConf, audioConf);
  };

  const getSuggestion = () => {
    if (!analysisData) return 'Unable to provide suggestion';
    
    const issue = getIssueFromAnalysis();
    
    switch (issue) {
      case 'tire':
        return 'Tire issue detected. We recommend checking tire pressure and condition. A tire change service may be needed.';
      case 'engine':
        return 'Engine issue detected. Professional diagnosis recommended. Check for warning lights and unusual sounds.';
      case 'battery':
        return 'Battery issue detected. Jump-start service may be needed. Check battery terminals and connections.';
      case 'accident':
        return 'Damage detected. Please ensure safety first. Professional assessment recommended.';
      default:
        return 'No specific issues detected. Vehicle appears to be in normal condition.';
    }
  };

  const handleRequestHelp = async () => {
    if (!locationData.address) {
      setError('Please provide your location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('issueType', getIssueFromAnalysis());
      formData.append('description', description || getSuggestion());
      formData.append('location', '0,0'); // Will be updated with actual coordinates
      formData.append('address', locationData.address);
      formData.append('priority', getIssueFromAnalysis() === 'accident' ? 'urgent' : 'medium');

      // Add files if available
      if (analysisData.image) {
        // Note: In a real app, you'd need to re-upload the files
        // For now, we'll create the request without files
      }

      const response = await api.post('/user/request-help', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const requestId = response.data.data.request._id;
      navigate(`/app/result/${requestId}`);
    } catch (error) {
      console.error('Request help error:', error);
      setError(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode to get address
          setLocationData(prev => ({
            ...prev,
            address: 'Current Location (GPS detected)'
          }));
        },
        (error) => {
          console.error('Location error:', error);
          setError('Unable to get your location. Please enter manually.');
        }
      );
    }
  };

  if (error && !analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analysis Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <button
            onClick={() => navigate('/app/scan')}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const confidence = getConfidence();
  const suggestion = getSuggestion();
  const detectedIssue = getIssueFromAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/app/scan')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Analysis
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Analysis Results
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what our AI detected from your vehicle analysis
          </p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          {/* Issue Detection */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
              detectedIssue === 'other' 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-yellow-100 dark:bg-yellow-900/20'
            }`}>
              {detectedIssue === 'other' ? (
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {detectedIssue === 'other' ? 'No Issues Detected' : 'Issue Detected'}
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{confidence}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Confidence</div>
              </div>
              
              {analysisData.image && (
                <div className="text-center">
                  <Camera className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">Image</div>
                </div>
              )}
              
              {analysisData.audio && (
                <div className="text-center">
                  <Mic className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">Audio</div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {analysisData.image && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Image Analysis
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
                    <span className={`text-sm font-medium ${
                      analysisData.image.detected ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {analysisData.image.detected ? 'Issues Found' : 'Normal'}
                    </span>
                  </div>
                  
                  {analysisData.image.detected && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Detected:</span>
                      <ul className="mt-1 space-y-1">
                        {analysisData.image.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            • {issue.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Confidence:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {analysisData.image.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {analysisData.audio && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  Audio Analysis
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
                    <span className={`text-sm font-medium ${
                      analysisData.audio.detected ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {analysisData.audio.detected ? 'Issues Found' : 'Normal'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Engine:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {analysisData.audio.engineStatus.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Confidence:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {analysisData.audio.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Suggestion */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              AI Recommendation
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              {suggestion}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Request Help Form */}
          <div className="space-y-6">
            <div>
              <label className="label">Your Location</label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={locationData.address}
                  onChange={(e) => setLocationData(prev => ({ ...prev, address: e.target.value }))}
                  className="input flex-1"
                  placeholder="Enter your location"
                />
                <button
                  onClick={getCurrentLocation}
                  className="btn btn-outline"
                >
                  Use GPS
                </button>
              </div>
            </div>

            <div>
              <label className="label">Additional Details (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input resize-none"
                rows={3}
                placeholder="Add any additional information about your issue..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/app/scan')}
                className="btn btn-outline flex-1"
              >
                Analyze Again
              </button>
              
              <button
                onClick={handleRequestHelp}
                disabled={loading || !locationData.address}
                className="btn btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Request Help
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            What happens next?
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3 mt-0.5">
                1
              </div>
              <p>We'll match you with nearby service providers</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3 mt-0.5">
                2
              </div>
              <p>Providers will receive your request and can accept it</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3 mt-0.5">
                3
              </div>
              <p>Track your provider's location and get real-time updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultPage;
