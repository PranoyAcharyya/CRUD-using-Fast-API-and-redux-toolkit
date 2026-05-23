const BASE_URL = "http://127.0.0.1:8000";

export const fetchNotesAPI = async () => {
  const response = await fetch(`${BASE_URL}/notes`);

  const data = await response.json();

  return data;
};

export const createNoteAPI = async (note) => {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(note),
  });
  const data = await response.json();

  return data;
};


export const deleteNoteAPI = async (id) => {

  const response = await fetch(
    `${BASE_URL}/notes/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  return data;
};

export const updateNoteAPI = async (id, updatedNote) => {

  const response = await fetch(
    `${BASE_URL}/notes/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(updatedNote),
    }
  );

  const data = await response.json();

  return data;
};