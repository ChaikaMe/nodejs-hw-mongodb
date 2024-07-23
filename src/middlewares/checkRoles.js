import createHttpError from 'http-errors';
import { ROLES } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contactModel.js';

export let adminCheck;

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401));
      return;
    }

    const { role } = user;
    if (roles.includes(ROLES.ADMIN) && role === ROLES.ADMIN) {
      adminCheck = true;
      next();
      return;
    }

    if (roles.includes(ROLES.USER) && role === ROLES.USER) {
      adminCheck = false;
      const { contactId } = req.params;

      if (!contactId) {
        next();
        return;
      }

      const contact = await ContactsCollection.findOne({
        _id: contactId,
        userId: user._id,
      });

      if (contact) {
        next();
        return;
      }
    }

    next(createHttpError(403, 'Forbidden'));
  };
