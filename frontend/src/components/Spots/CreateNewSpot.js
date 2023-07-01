/*
User Stories
-As an authenticated user, I want to create a spot to include in the listings.
-As an authenticated user, if I make a mistake while creating a spot, I want 
useful error messages (a.k.a. validation).
-As an authenticated user, when I successfully create a spot, I want to see its 
details immediately.

Acceptance Criteria

✓ -There should be a "Create a New Spot" button in the navigation bar to the left
 of the User Menu button for logged-in users.
✓ -Upon clicking the "Create a New Spot" button, the user should be navigated to a 
blank form to gather the data for a new spot (see wireframe).
✓ -On the new spot form, there should be: a title at the top with the text "Create
 a New Spot".
✓✓-The first section should include: ✓ a heading of "Where's your place located?", a 
✓ caption of "Guests will only get your exact address once they booked a 
reservation.", and text inputs with labels and placeholders for "Country", 
"Street Address", "City", and "State" ("Latitude" and "Longitude" inputs are 
optional for MVP) [DO I HAVE TO INCLUDE LABELS?]
✓✓-The second section should include: ✓  a heading of "Describe your place to guests",
 ✓ a caption of "Mention the best features of your space, any special amentities
  like fast wifi or parking, and what you love about the neighborhood.", and  ✓ a 
  text area with a placeholder of "Please write at least 30 characters".
✓✓ -The third section should include: ✓ a heading of "Create a title for your spot",
 ✓ a caption of "Catch guests' attention with a spot title that highlights what 
 makes your place special.", and a text input with a placeholder of "Name of 
 your spot".
✓✓-The fourth section should include: a heading of "Set a base price for your spot"
, a caption of "Competitive pricing can help your listing stand out and rank 
higher in search results.", and a number input with a placeholder of "Price per
 night (USD)".
✓✓ -The fifth section should include: a heading of "Liven up your spot with photos",
 a caption of "Submit a link to at least one photo to publish your spot.", and 
 five text inputs where the first input has a placeholder of "Preview Image URL"
  and the rest of the inputs have a placeholder of "Image URL".
✓✓-The submit button should have the text of "Create Spot".
-Validation messages must show at the top of the form or under each field with an
 error if the user tries to submit an incomplete form. Examples: a * Required 
 Field: " is required" (e.g. "Price per night is required", etc.), a Description
  Min Length: "Description needs 30 or more characters". Out of the five image 
  URL inputs, only the first Image URL input (the Preview Image URL) is required.
-When a spot is successfully created, the user should automatically be navigated 
to the new spot's detail page.
-Navigating away and back to the create spot form form resets any errors and 
clears all data entered, so it displays in the default state (no errors, *empty 
    inputs, button disabled).
*/
import { useDispatch } from "react-redux";
import { createSpot } from "../../store/spots";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Spots.css";

const CreateNewSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  //   const [lat, setLat] = useState("");
  //   const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [otherImages, setOtherImages] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Object.keys(errors).length) {
      const newSpot = {
        country,
        address,
        city,
        state,
        // lat,
        // lng,
        description,
        name,
        price,
        previewImage,
        otherImages,
      };
      dispatch(createSpot(newSpot)).then((createdSpot) => {
        history.push(`/api/spots/${createdSpot.id}`);
      });

      //reset form inputs and errors
      setCountry("");
      setAddress("");
      setCity("");
      setState("");
      //   setLat("");
      //   setLng("");
      setDescription("");
      setName("");
      setPrice("");
      setPreviewImage("");
      setOtherImages("");
      setErrors({});
    }
  };

  //Check for errors in real time. Display them until they are resolved.
  useEffect(() => {
    const validationErrors = {};

    //validation errors for form
    if (description.length < 30)
      validationErrors["description"] =
        "Description needs 30 or more characters.";
    if (!country) validationErrors["country"] = "Country is required";
    if (!address) validationErrors["address"] = "Street address is required";
    if (!city) validationErrors["city"] = "City is required";
    if (!state) validationErrors["state"] = "State is required";
    if (!description)
      validationErrors["description"] = "Description is required";
    if (!name) validationErrors["name"] = "Title of your spot is required";
    if (!price) validationErrors["price"] = "Base price is required";
    if (!previewImage)
      validationErrors["previewImage"] = "Preview image is required";

    setErrors(validationErrors);
  }, [country, address, city, state, description, name, price, previewImage]);

  return (
    <div className="create-spot-form-div">
      <h2 className="create-spot-form-header">Create New Spot</h2>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <h3>Where's your place located?</h3>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          //   required
        />
        <div>{errors.country && `* ${errors.country}`}</div>
        <input
          type="text"
          placeholder="Street address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          //   required
        />
        <div>{errors.address && `* ${errors.address}`}</div>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          //   required
        />
        <div>{errors.city && `* ${errors.city}`}</div>
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          //   required
        />
        <div>{errors.state && `* ${errors.state}`}</div>
        {/* <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        /> */}
        <h3>Describe your place to your guests</h3>
        <p>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <textarea
          type="text"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          //   required
        />
        <div>{errors.description && `* ${errors.description}`}</div>
        <h3>Create a title for your spot</h3>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          //   required
        />
        <div>{errors.name && `* ${errors.name}`}</div>
        <h3>Set a base price</h3>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        <input
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          //   required
        />
        <div>{errors.price && `* ${errors.price}`}</div>
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input
          type="text"
          placeholder="Preview image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          //   required
        />
        <div>{errors.previewImage && `* ${errors.previewImage}`}</div>
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <button
          className="create-spot-form-button"
          type="submit"
          disabled={Object.keys(errors).length ? true : false}
        >
          Create Spot
        </button>
      </form>
    </div>
  );
};

export default CreateNewSpot;
