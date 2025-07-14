import QuestionList from "../../components/ask/QuestionList";
import ProtectedRoute from "../../components/shared/ProtectedRoute";

export default function AskPage() {
  return (
    <ProtectedRoute>
      <QuestionList />
    </ProtectedRoute>
  );
}
