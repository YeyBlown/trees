import baseUrl from "./base_url";

const getDefaultPagenation = () => {
  return {
    query: "",
    search_by: "username",
    page: 0,
    page_size: 10,
    sort_by: "id",
    asc_order: true,
    ignore_pagination: false,
  };
};

export function cheatToken(){
    fetch(`${baseUrl}0/auth/token`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa('username:password'),
            'Content-Type': 'application/x-www-form-urlencoded'
            // 'Content-Type': 'application/json',
        },
        body:
            `username=root&password=root`
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        }).then(
            (data) => {return data}
        )
        .catch((error) => {
            console.error('Error:', error);
        });
}

export function handleDelete() {
  const token = cheatToken().token
  console.log(token);
  fetch(`${baseUrl}/user/user`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function createUser(email, password, name, surname, description) {
  fetch(`${baseUrl}/user/create`, {
    method: "POST",
    headers: {
        
      "Content-Type": "application/json",
      // 'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: `${email}`,
      hashed_password: `${password}`,
      name: `${name}`,
      surname: `${surname}`,
      description: `${description}`,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function createTree(lat, lng, treename, age, crownRadius) {
    const cheats = cheatToken()
    fetch(`${baseUrl}/tree/create`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cheats.token,
        "Content-Type": "application/json",
        // 'Content-Type': 'application/json',
      },
    
      body: JSON.stringify({
        location_lat: `${lat}`,
        location_lon: `${lng}`,
        core_radius: `${crownRadius}`,
        creation_year: age,
        plant_type: `${treename}`,
        creator_id: cheats.user.id
      }),
    })
      .then((response) => response.json())
      .then((data) => {return data})
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  export function deleteTree(id) {
      const cheats = cheatToken()
      fetch(`${baseUrl}/tree/delete`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + cheats.token,
          "Content-Type": "application/json",
          // 'Content-Type': 'application/json',
        },
      
        body: JSON.stringify({
          tree_id: id
        }),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error:", error);
        });
    }

export function handleMe() {
  const token = cheatToken().token
  console.log(token);
  fetch(`${baseUrl}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function getMarkers(lat, lng, radius) {
  const pagenation = getDefaultPagenation();
  pagenation["ignore_pagination"] = true;
  const geo = {
    location_lat: lat,
    location_lon: lng,
    search_radius: radius,
  };
  fetch(`${baseUrl}/tree/search`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        "paginated_search": pagenation,
        "tree_search": geo,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
