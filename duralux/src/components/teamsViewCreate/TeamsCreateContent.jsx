"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/shared/Input";
import TextArea from "@/components/shared/TextArea";
import Loading from "@/components/shared/Loading";
import { teamService } from "@/lib/services/team.service";
import { useRouter } from "next/navigation";

const TeamsCreateContent = () => {
  console.log(
    "🟡 TeamsCreateContent render token:",
    localStorage.getItem("accessToken"),
  );

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
        : [...prev, userId],
    );
  };

  const handleSubmit = async () => {
    try {
      await teamService.create({
        name,
        memberIds: selectedUserIds,
      });

      router.push("/teams/list");
    } catch (err) {
      console.error(err);
      alert("Ekip oluşturulamadı");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <div className="card-body">
          <h5 className="fw-bold mb-4">Ekip Bilgileri</h5>

          <Input
            label="Ekip Adı"
            placeholder="Frontend Ekibi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextArea
            label="Açıklama"
            placeholder="Bu ekip frontend geliştirmeden sorumludur"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="mb-4">
            <label className="form-label">Ekip Üyeleri</label>

            {users.map((user) => (
              <div key={user.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
                <label className="form-check-label">
                  {user.username} ({user.email})
                </label>
              </div>
            ))}
          </div>

         <button
  className="btn text-white"
  onClick={handleSubmit}
  disabled={!name || selectedUserIds.length === 0}
  style={{
    backgroundColor: "#E92B63",
    borderColor: "#E92B63",
    opacity: !name || selectedUserIds.length === 0 ? 0.6 : 1,
    cursor:
      !name || selectedUserIds.length === 0 ? "not-allowed" : "pointer",
  }}
>
  Ekip Oluştur
</button>

        </div>
      </div>
    </div>
  );
};

export default TeamsCreateContent;
