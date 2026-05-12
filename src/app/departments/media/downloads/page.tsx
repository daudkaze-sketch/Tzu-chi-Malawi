'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, Search, Filter, FileText, Camera, Video, File } from 'lucide-react';

interface MediaFile {
  id: string;
  title: string;
  type: string;
  department: string;
  date: string;
  description?: string;
  filePath: string;
  createdAt: string;
}

export default function DownloadsPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      setFiles(data.media || []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (filePath: string, type: string) => {
    if (type === 'document') {
      if (filePath.includes('.pdf')) {
        return <FileText className="w-6 h-6 text-red-500" />;
      } else if (filePath.includes('.ppt') || filePath.includes('.pptx')) {
        return <File className="w-6 h-6 text-orange-500" />;
      } else if (filePath.includes('.doc') || filePath.includes('.docx')) {
        return <FileText className="w-6 h-6 text-blue-500" />;
      } else if (filePath.includes('.xls') || filePath.includes('.xlsx')) {
        return <File className="w-6 h-6 text-green-500" />;
      }
      return <FileText className="w-6 h-6 text-gray-500" />;
    } else if (type === 'work-report' || type === 'photo') {
      return <Camera className="w-6 h-6 text-blue-500" />;
    } else if (type === 'video') {
      return <Video className="w-6 h-6 text-red-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const getFileType = (filePath: string, type: string) => {
    if (type === 'document') {
      if (filePath.includes('.pdf')) return 'PDF';
      if (filePath.includes('.ppt') || filePath.includes('.pptx')) return 'PowerPoint';
      if (filePath.includes('.doc') || filePath.includes('.docx')) return 'Word';
      if (filePath.includes('.xls') || filePath.includes('.xlsx')) return 'Excel';
      if (filePath.includes('.txt')) return 'Text';
      return 'Document';
    } else if (type === 'work-report' || type === 'photo') {
      return 'Image';
    } else if (type === 'video') {
      return 'Video';
    }
    return 'File';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || file.type === selectedType;
    const matchesDepartment = !selectedDepartment || file.department === selectedDepartment;

    return matchesSearch && matchesType && matchesDepartment;
  });

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/departments/media"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
          <span>Back to Media Department</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Downloads</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="document">Documents</option>
              <option value="work-report">Work Reports</option>
              <option value="photo">Photos</option>
              <option value="video">Videos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              <option value="Education">Education</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Charity">Charity</option>
              <option value="Media">Media</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('');
                setSelectedDepartment('');
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2"
            >
              <Filter size={16} />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Files ({filteredFiles.length})
          </h2>
        </div>

        {filteredFiles.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file.filePath, file.type)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{file.title}</h3>
                      <p className="text-sm text-gray-600">{file.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{file.department}</span>
                        <span>{getFileType(file.filePath, file.type)}</span>
                        <span>{new Date(file.date).toLocaleDateString()}</span>
                        <span>Uploaded {new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={file.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </a>
                    <button
                      onClick={() => handleDownload(file.filePath, file.title)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-500">
              {files.length === 0
                ? "No files have been uploaded yet."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}