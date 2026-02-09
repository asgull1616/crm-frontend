"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/shared/Input";
import TextArea from "@/components/shared/TextArea";
import Loading from "@/components/shared/Loading";
import { teamService } from "@/lib/services/team.service";
import { useRouter } from "next/navigation";

const TeamsCreateContent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    teamService.listUsers().then((res) => {
      setUsers(res.data.data);
    });
  }, []);

  const toggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await teamService.create({
        name,
        memberIds: selectedUserIds,
      });

      router.push("/teams/list");
    } catch (err) {
      console.error(err);
      alert("Ekip oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <div className="card-body">

          {/* TEAM PREVIEW */}
          <div className="team-summary mb-4">
            <div className="team-avatar-lg">
              {name ? name.slice(0, 2).toUpperCase() : "TM"}
            </div>

            <h3 className="mt-3 mb-1">
              {name || "Ekip Adı"}
            </h3>

            <p className="text-muted">
              {description || "Ekip açıklaması"}
            </p>

            <div className="team-summary-stats">
              <div>
                <strong>{selectedUserIds.length}</strong>
                <span>Üye</span>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="team-field">
                <label className="team-field-label">Ekip Adı:</label>

                <div className="team-field-control">
                  <input
                    className="form-control team-control"
                    placeholder="Frontend Ekibi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="team-field">
                <label className="team-field-label">Açıklama:</label>

                <div className="team-field-control">
                  <textarea
                    className="form-control team-control team-textarea"
                    placeholder="Bu ekip frontend geliştirmeden sorumludur"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>



          {/* MEMBER SELECT */}
          <h5 className="fw-bold mb-3">Ekip Üyeleri</h5>

          <div className="members-grid">
            {users.map((user) => {
              const selected = selectedUserIds.includes(user.id);

              return (
                <div
                  key={user.id}
                  className={`member-card ${selected ? "selected" : ""}`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="member-avatar">
                    {user.username?.[0]?.toUpperCase()}
                  </div>

                  <div className="member-name">{user.username}</div>
                  <div className="member-email">{user.email}</div>

                  {selected && (
                    <span className="member-selected-check">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTION */}
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn text-white px-4"
              onClick={handleSubmit}
              disabled={!name || selectedUserIds.length === 0}
              style={{
                backgroundColor: "#E92B63",
                borderColor: "#E92B63",
                opacity: !name || selectedUserIds.length === 0 ? 0.6 : 1,
                cursor:
                  !name || selectedUserIds.length === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Ekip Oluştur
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamsCreateContent;
