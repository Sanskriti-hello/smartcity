import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../store/slices/announcementsSlice'
import { format } from 'date-fns'
import { Plus, Edit, Trash2, Bell, Users, Globe } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const AnnouncementManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { announcements, isLoading } = useSelector((state: RootState) => state.announcements)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    title: string
    content: string
    target_audience: 'all' | 'citizens' | 'service_providers'
    expires_at?: string
  }>()

  useEffect(() => {
    dispatch(fetchAnnouncements())
  }, [dispatch])

  const onSubmitCreate = async (data: any) => {
    try {
      await dispatch(createAnnouncement(data)).unwrap()
      toast.success('Announcement created successfully!')
      setShowCreateModal(false)
      reset()
    } catch (error: any) {
      toast.error(error || 'Failed to create announcement')
    }
  }

  const onSubmitUpdate = async (data: any) => {
    if (!selectedAnnouncement) return

    try {
      await dispatch(updateAnnouncement({ id: selectedAnnouncement.announcement_id, data })).unwrap()
      toast.success('Announcement updated successfully!')
      setShowUpdateModal(false)
      setSelectedAnnouncement(null)
    } catch (error: any) {
      toast.error(error || 'Failed to update announcement')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await dispatch(deleteAnnouncement(id)).unwrap()
        toast.success('Announcement deleted successfully!')
      } catch (error: any) {
        toast.error(error || 'Failed to delete announcement')
      }
    }
  }

  const openUpdateModal = (announcement: any) => {
    setSelectedAnnouncement(announcement)
    reset({
      title: announcement.title,
      content: announcement.content,
      target_audience: announcement.target_audience,
      expires_at: announcement.expires_at ? announcement.expires_at.split('T')[0] : ''
    })
    setShowUpdateModal(true)
  }

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'all':
        return <Globe className="h-4 w-4" />
      case 'citizens':
        return <Users className="h-4 w-4" />
      case 'service_providers':
        return <Users className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTargetColor = (target: string) => {
    switch (target) {
      case 'all':
        return 'bg-blue-100 text-blue-800'
      case 'citizens':
        return 'bg-green-100 text-green-800'
      case 'service_providers':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcement Management</h1>
            <p className="text-gray-600">
              Create and manage city-wide announcements for citizens and service providers.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="spinner"></div>
          </div>
        ) : announcements.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement.announcement_id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {announcement.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTargetColor(announcement.target_audience)}`}>
                        {getTargetIcon(announcement.target_audience)}
                        <span className="ml-1">{announcement.target_audience?.replace('_', ' ') || ''}</span>
                      </span>
                      {!announcement.is_active && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {announcement.content}
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {format(new Date(announcement.created_at), 'MMM dd, yyyy')}</span>
                      <span>By: {announcement.created_by_first_name} {announcement.created_by_last_name}</span>
                      {announcement.expires_at && (
                        <span>Expires: {format(new Date(announcement.expires_at), 'MMM dd, yyyy')}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 space-x-2">
                    <button
                      onClick={() => openUpdateModal(announcement)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.announcement_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first announcement.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary btn-sm"
              >
                Create Announcement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create New Announcement
              </h3>
              <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    {...register('title', {
                      required: 'Title is required',
                      minLength: {
                        value: 5,
                        message: 'Title must be at least 5 characters',
                      },
                    })}
                    type="text"
                    className="input"
                    placeholder="Announcement title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    {...register('content', {
                      required: 'Content is required',
                      minLength: {
                        value: 10,
                        message: 'Content must be at least 10 characters',
                      },
                    })}
                    rows={4}
                    className="input"
                    placeholder="Announcement content"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    {...register('target_audience')}
                    className="input"
                    defaultValue="all"
                  >
                    <option value="all">All Users</option>
                    <option value="citizens">Citizens Only</option>
                    <option value="service_providers">Service Providers Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires At (Optional)
                  </label>
                  <input
                    {...register('expires_at')}
                    type="date"
                    className="input"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Create Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Announcement
              </h3>
              <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    {...register('title', {
                      required: 'Title is required',
                      minLength: {
                        value: 5,
                        message: 'Title must be at least 5 characters',
                      },
                    })}
                    type="text"
                    className="input"
                    placeholder="Announcement title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    {...register('content', {
                      required: 'Content is required',
                      minLength: {
                        value: 10,
                        message: 'Content must be at least 10 characters',
                      },
                    })}
                    rows={4}
                    className="input"
                    placeholder="Announcement content"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    {...register('target_audience')}
                    className="input"
                  >
                    <option value="all">All Users</option>
                    <option value="citizens">Citizens Only</option>
                    <option value="service_providers">Service Providers Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires At (Optional)
                  </label>
                  <input
                    {...register('expires_at')}
                    type="date"
                    className="input"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Update Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnnouncementManagement
