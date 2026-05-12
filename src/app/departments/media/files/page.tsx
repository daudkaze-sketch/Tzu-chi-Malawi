'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Folder, FolderOpen, FileText, Camera, Video, File, Download, Eye } from 'lucide-react';

interface FileItem {
  id: string;
  title: string;
  type: string;
  department: string;
  date: string;
  filePath: string;
  createdAt: string;
}

interface FolderStructure {
  [year: string]: {
    [month: string]: {
      [day: string]: FileItem[];
    };
  };
}

export default function FileManagerPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

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

  const organizeFilesByDate = (files: FileItem[]): FolderStructure => {
    const structure: FolderStructure = {};

    files.forEach(file => {
      const date = new Date(file.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      if (!structure[year]) structure[year] = {};
      if (!structure[year][month]) structure[year][month] = {};
      if (!structure[year][month][day]) structure[year][month][day] = [];

      structure[year][month][day].push(file);
    });

    return structure;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (filePath: string, type: string) => {
    if (type === 'document') {
      if (filePath.includes('.pdf')) {
        return <FileText className="w-5 h-5 text-red-500" />;
      } else if (filePath.includes('.ppt') || filePath.includes('.pptx')) {
        return <File className="w-5 h-5 text-orange-500" />;
      } else if (filePath.includes('.doc') || filePath.includes('.docx')) {
        return <FileText className="w-5 h-5 text-blue-500" />;
      } else if (filePath.includes('.xls') || filePath.includes('.xlsx')) {
        return <File className="w-5 h-5 text-green-500" />;
      }
      return <FileText className="w-5 h-5 text-gray-500" />;
    } else if (type === 'work-report' || type === 'photo') {
      return <Camera className="w-5 h-5 text-blue-500" />;
    } else if (type === 'video') {
      return <Video className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
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

  const folderStructure = organizeFilesByDate(files);

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

      <h1 className="text-3xl font-bold text-gray-800 mb-8">File Manager</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Organized by Date</h2>
          <p className="text-sm text-gray-600">
            Files are automatically organized by year, month, and day for easy management.
          </p>
        </div>

        {Object.keys(folderStructure).length > 0 ? (
          <div className="space-y-2">
            {Object.keys(folderStructure)
              .sort((a, b) => b.localeCompare(a)) // Sort years descending
              .map(year => (
                <div key={year} className="border border-gray-200 rounded-lg">
                  <div
                    className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleFolder(`year-${year}`)}
                  >
                    {expandedFolders.has(`year-${year}`) ? (
                      <FolderOpen className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Folder className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="font-medium text-gray-800">{year}</span>
                    <span className="text-sm text-gray-500">
                      ({Object.values(folderStructure[year]).reduce((total, month) =>
                        total + Object.values(month).reduce((dayTotal, files) => dayTotal + files.length, 0), 0
                      )} files)
                    </span>
                  </div>

                  {expandedFolders.has(`year-${year}`) && (
                    <div className="ml-6 space-y-1">
                      {Object.keys(folderStructure[year])
                        .sort((a, b) => b.localeCompare(a)) // Sort months descending
                        .map(month => (
                          <div key={month} className="border-l border-gray-200">
                            <div
                              className="flex items-center space-x-2 p-3 cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleFolder(`year-${year}-month-${month}`)}
                            >
                              {expandedFolders.has(`year-${year}-month-${month}`) ? (
                                <FolderOpen className="w-4 h-4 text-green-600" />
                              ) : (
                                <Folder className="w-4 h-4 text-green-600" />
                              )}
                              <span className="font-medium text-gray-700">
                                {new Date(2024, parseInt(month) - 1).toLocaleString('default', { month: 'long' })} {year}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({Object.values(folderStructure[year][month]).reduce((total, files) => total + files.length, 0)} files)
                              </span>
                            </div>

                            {expandedFolders.has(`year-${year}-month-${month}`) && (
                              <div className="ml-6 space-y-1">
                                {Object.keys(folderStructure[year][month])
                                  .sort((a, b) => b.localeCompare(a)) // Sort days descending
                                  .map(day => (
                                    <div key={day} className="border-l border-gray-200">
                                      <div
                                        className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-50"
                                        onClick={() => toggleFolder(`year-${year}-month-${month}-day-${day}`)}
                                      >
                                        {expandedFolders.has(`year-${year}-month-${month}-day-${day}`) ? (
                                          <FolderOpen className="w-4 h-4 text-purple-600" />
                                        ) : (
                                          <Folder className="w-4 h-4 text-purple-600" />
                                        )}
                                        <span className="font-medium text-gray-600">
                                          {new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString()}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          ({folderStructure[year][month][day].length} files)
                                        </span>
                                      </div>

                                      {expandedFolders.has(`year-${year}-month-${month}-day-${day}`) && (
                                        <div className="ml-6 space-y-1">
                                          {folderStructure[year][month][day].map(file => (
                                            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                              <div className="flex items-center space-x-3">
                                                {getFileIcon(file.filePath, file.type)}
                                                <div>
                                                  <span className="text-sm font-medium text-gray-800">{file.title}</span>
                                                  <div className="text-xs text-gray-500">
                                                    {file.department} • {getFileType(file.filePath, file.type)}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex space-x-1">
                                                <a
                                                  href={file.filePath}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 hover:text-blue-800 p-1"
                                                  title="View"
                                                >
                                                  <Eye size={14} />
                                                </a>
                                                <button
                                                  onClick={() => handleDownload(file.filePath, file.title)}
                                                  className="text-green-600 hover:text-green-800 p-1"
                                                  title="Download"
                                                >
                                                  <Download size={14} />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files organized yet</h3>
            <p className="text-gray-500">Upload files to see them organized by date.</p>
          </div>
        )}
      </div>
    </div>
  );
}