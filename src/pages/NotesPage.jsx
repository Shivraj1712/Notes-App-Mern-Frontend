import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes");
      setNotes(res.data.notes || res.data);
    } catch {
      toast.error("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openModal = (note = null) => {
    setSelectedNote(note);
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warning("Please fill in both title and content.");
      return;
    }

    try {
      if (selectedNote) {
        await axiosInstance.put(`/notes/${selectedNote._id}`, { title, content });
        toast.success("Note updated successfully.");
      } else {
        await axiosInstance.post("/notes/create", { title, content });
        toast.success("Note created successfully.");
      }
      await fetchNotes();
      closeModal();
    } catch {
      toast.error("Failed to save note.");
    }
  };

  const openDeleteModal = (note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setNoteToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await axiosInstance.delete(`/notes/${noteToDelete._id}`);
      setNotes(notes.filter((note) => note._id !== noteToDelete._id));
      toast.info("Note deleted.");
    } catch {
      toast.error("Failed to delete note.");
    } finally {
      closeDeleteModal();
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-800 text-green-400">
        Loading notes...
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-green-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-400">Your Notes</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} /> Add Note
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-400 text-center">No notes yet. Create one.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-green-700/20 transition"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-2">
                  {note.title}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-3">{note.content}</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => openModal(note)}
                    className="text-green-400 hover:text-green-300 transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(note)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-11/12 max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-green-400 mb-4">
              {selectedNote ? "Edit Note" : "New Note"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="5"
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
              >
                {selectedNote ? "Update Note" : "Create Note"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-11/12 max-w-sm text-center">
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-green-400 font-semibold">
                {noteToDelete?.title}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        theme="dark"
      />
    </section>
  );
}
