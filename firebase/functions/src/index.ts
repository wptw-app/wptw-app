import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onReviewCreate = functions.firestore
  .document('companies/{companyId}/reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const companyId = context.params.companyId;
    const companyRef = admin.firestore().collection('companies').doc(companyId);
    await admin.firestore().runTransaction(async (tx) => {
      const companySnap = await tx.get(companyRef);
      const rating = data.rating as number;
      let avg = rating;
      let count = 1;
      if (companySnap.exists) {
        const { reviewCount = 0, averageRating = 0 } = companySnap.data()!;
        avg = (averageRating * reviewCount + rating) / (reviewCount + 1);
        count = reviewCount + 1;
      }
      tx.set(companyRef, { averageRating: avg, reviewCount: count }, { merge: true });
    });
  });
