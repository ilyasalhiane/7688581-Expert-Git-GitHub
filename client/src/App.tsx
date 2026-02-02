import { useEffect, useMemo, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  name: string;
  email: string;
  role: string;
};

const emptyForm: FormState = { name: "", email: "", role: "user" };

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  const fetchUsers = async () => {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = (await response.json()) as User[];
      setUsers(data);
    } catch (error) {
      setStatus("Unable to load users. Check the API connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, [apiBaseUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState(emptyForm);
    setEditingUserId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      role: formState.role.trim() || "user"
    };

    if (!payload.name || !payload.email) {
      setStatus("Name and email are required.");
      return;
    }

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/users${editingUserId ? `/${editingUserId}` : ""}`,
        {
          method: editingUserId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      await fetchUsers();
      resetForm();
      setStatus(editingUserId ? "User updated." : "User created.");
    } catch (error) {
      setStatus("Something went wrong while saving the user.");
    }
  };

  const startEdit = (user: User) => {
    setEditingUserId(user._id);
    setFormState({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const handleDelete = async (userId: string) => {
    setStatus("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      await fetchUsers();
      setStatus("User removed.");
    } catch (error) {
      setStatus("Unable to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            React • Tailwind • Express • MongoDB
          </p>
          <h1 className="text-3xl font-semibold text-white">User Management</h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Create, update, and remove users from the MongoDB collection. The
            UI stays in sync with the Express API.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-900/40">
            <h2 className="text-lg font-semibold">
              {editingUserId ? "Edit user" : "Add a new user"}
            </h2>
            <p className="text-sm text-slate-400">
              Keep profiles up to date. Emails must be unique.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-400">
                  Name
                </label>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-400">
                  Email
                </label>
                <input
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-400">
                  Role
                </label>
                <input
                  name="role"
                  value={formState.role}
                  onChange={handleChange}
                  placeholder="admin"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  {editingUserId ? "Save changes" : "Create user"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
                >
                  Clear
                </button>
              </div>
            </form>
            {status && (
              <p className="mt-4 text-sm text-indigo-300" role="status">
                {status}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Current users</h2>
                <p className="text-sm text-slate-400">
                  {loading
                    ? "Loading data..."
                    : `${users.length} users in the collection`}
                </p>
              </div>
              <button
                onClick={() => void fetchUsers()}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-500"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {users.length === 0 && !loading ? (
                <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                  No users yet. Create the first one on the left.
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <p className="text-xs text-indigo-300">{user.role}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void handleDelete(user._id)}
                        className="rounded-lg bg-rose-500/90 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <footer className="text-xs text-slate-500">
          Configure the API URL via <code>VITE_API_URL</code> in your
          environment.
        </footer>
      </div>
    </div>
  );
};

export default App;
