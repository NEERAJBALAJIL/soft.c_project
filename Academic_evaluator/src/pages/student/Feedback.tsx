
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Calendar, Star, BookOpen } from 'lucide-react';
import { mockStudentData } from '@/data/mockData';
import Layout from '@/components/Layout';

const StudentFeedback = () => {
  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'outstanding': return 'bg-green-100 text-green-800 border-green-200';
      case 'excellent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingStars = (rating: string) => {
    const ratings = {
      'outstanding': 5,
      'excellent': 4,
      'good': 3,
      'average': 2,
      'poor': 1
    };
    const stars = ratings[rating.toLowerCase() as keyof typeof ratings] || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Feedback</p>
                  <p className="text-3xl font-bold text-blue-800">{mockStudentData.feedback.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Positive Reviews</p>
                  <p className="text-3xl font-bold text-green-800">
                    {mockStudentData.feedback.filter(f => ['excellent', 'outstanding'].includes(f.rating.toLowerCase())).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Recent Feedback</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {mockStudentData.feedback.filter(f => 
                      new Date(f.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>Faculty Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockStudentData.feedback.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{feedback.subject}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{feedback.staff}</span>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(feedback.date)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getRatingColor(feedback.rating)}>
                      {feedback.rating}
                    </Badge>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mb-4">
                    {getRatingStars(feedback.rating)}
                    <span className="ml-2 text-sm text-gray-600">Rating</span>
                  </div>

                  {/* Comment */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Faculty feedback on academic performance</span>
                      <span>Submitted on {formatDate(feedback.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating Distribution */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Rating Distribution</h4>
                <div className="space-y-3">
                  {['Outstanding', 'Excellent', 'Good', 'Average'].map((rating) => {
                    const count = mockStudentData.feedback.filter(f => 
                      f.rating.toLowerCase() === rating.toLowerCase()
                    ).length;
                    const percentage = (count / mockStudentData.feedback.length) * 100;
                    
                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="w-20 text-sm font-medium">{rating}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Strengths */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Key Strengths Mentioned</h4>
                <div className="space-y-2">
                  {[
                    'Problem-solving skills',
                    'Creative approach to projects',
                    'Good code structure',
                    'Active participation',
                    'Consistent performance'
                  ].map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm mb-2">
                <strong>Suggestion from Faculty:</strong>
              </p>
              <p className="text-yellow-700">
                Based on recent feedback, focus on query optimization in Database Management and 
                continue the excellent work in algorithm implementation. Your creativity in web 
                development projects is particularly noteworthy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentFeedback;
