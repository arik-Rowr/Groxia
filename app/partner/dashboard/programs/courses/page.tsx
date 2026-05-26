import React from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number | 'Free';
  enrolled: number;
  status: 'Published' | 'Draft' | 'Archived';
}

const mockCourses: Course[] = [
  {
    id: 'crs-101',
    title: 'Advanced Full-Stack Web Development',
    instructor: 'Abhiman',
    price: 49.99,
    enrolled: 340,
    status: 'Published',
  },
  {
    id: 'crs-102',
    title: 'Mastering Tailwind CSS & UI Design',
    instructor: 'Abhiman',
    price: 'Free',
    enrolled: 0,
    status: 'Draft',
  },
];

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-gray-500 mt-1">Manage your educational content, curriculum, and pricing.</p>
        </div>
        <Link 
          href="/programs/courses/create" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          + Create New Course
        </Link>
      </header>

      <div className="grid gap-6">
        {mockCourses.map((course) => (
          <div 
            key={course.id} 
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex-1 mb-4 md:mb-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.status === 'Published' ? 'bg-green-100 text-green-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
              
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{course.enrolled} Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.price === 'Free' ? 'Free' : `$${course.price}`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex w-full md:w-auto gap-3">
              <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Analytics
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Edit Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}