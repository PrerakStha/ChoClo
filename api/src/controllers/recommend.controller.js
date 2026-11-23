import { recommendProductSize, suggestStyle } from "../services/recommend.service.js";
import { handleError } from "../utils/handleError.js";
import { httpError } from "../utils/httpError.js";

export async function recommendSize(req, res) {
  try {
    res.json(await recommendProductSize(req.body));
  } catch (err) {
    handleError(err, res);
  }
}

export async function recommendStyle(req, res) {
  try {
    const description = req.body.description || "";
    const photo = req.file;

    if (!description && !photo) {
      throw httpError(400, "Describe yourself or add a photo");
    }
    if (photo && req.body.consent !== "true") {
      throw httpError(400, "Please confirm you are happy for us to analyse your photo");
    }

    // the photo only ever lives in memory for this request, and is never saved or logged
    res.json(await suggestStyle(req.user.id, { description, photo }));
  } catch (err) {
    handleError(err, res);
  }
}