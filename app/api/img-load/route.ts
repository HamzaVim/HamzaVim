export async function GET(request: Request) {
  // Get the url from the request
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url)
    // Return error if the url is not provided
    return new Response(JSON.stringify({ error: "Missing ID" }), {
      status: 400,
    });

  // Fetch the image.
  const driveResponse = await fetch(url);

  if (!driveResponse.ok) {
    // Return error if the image is not found
    return new Response(driveResponse.statusText, {
      status: driveResponse.status,
    });
  }

  // Return the image
  return new Response(driveResponse.body, {
    headers: {
      "Content-Type": driveResponse.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
