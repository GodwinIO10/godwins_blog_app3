// Generate a key to combine with JWT token for creating signature

const key = [...Array(50)]
    .map((n) => ((Math.random() * 36) | 0).toString(36))
    .join("")

    //50 characters long, base36 encoded
    console.log(key)