"""Tasks CRUD with ownership via project and pagination."""
from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Project, Task
from routes.auth import get_current_user_id

tasks_bp = Blueprint("tasks", __name__)

PER_PAGE = 10


def _require_auth():
    user_id = get_current_user_id()
    if not user_id:
        return None, jsonify({"error": "Not authenticated"}), 401
    return user_id, None, None


def _get_project_or_404(project_id, user_id):
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return None, jsonify({"error": "Project not found"}), 404
    return project, None, None


@tasks_bp.route("/<int:project_id>/tasks", methods=["GET"])
def index(project_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", PER_PAGE, type=int), 50)
    per_page = max(1, per_page)
    pagination = Task.query.filter_by(project_id=project_id).order_by(Task.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    items = [t.to_dict() for t in pagination.items]
    return jsonify({
        "tasks": items,
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "pages": pagination.pages,
    }), 200


@tasks_bp.route("/<int:project_id>/tasks", methods=["POST"])
def create(project_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Task title is required"}), 400
    due_date = None
    if data.get("due_date"):
        try:
            due_date = datetime.fromisoformat(data["due_date"].replace("Z", "+00:00")).date()
        except (ValueError, TypeError):
            pass
    status = (data.get("status") or "pending").strip().lower()
    if status not in ("pending", "complete"):
        status = "pending"
    task = Task(title=title, due_date=due_date, status=status, project_id=project_id)
    db.session.add(task)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create task"}), 500
    return jsonify(task.to_dict()), 201


@tasks_bp.route("/<int:project_id>/tasks/<int:task_id>", methods=["GET"])
def get(project_id, task_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    task = Task.query.filter_by(id=task_id, project_id=project_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict()), 200


@tasks_bp.route("/<int:project_id>/tasks/<int:task_id>", methods=["PATCH", "PUT"])
def update(project_id, task_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    task = Task.query.filter_by(id=task_id, project_id=project_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    if "title" in data:
        title = (data.get("title") or "").strip()
        if not title:
            return jsonify({"error": "Task title cannot be empty"}), 400
        task.title = title
    if "due_date" in data:
        if data["due_date"] is None or data["due_date"] == "":
            task.due_date = None
        else:
            try:
                task.due_date = datetime.fromisoformat(str(data["due_date"]).replace("Z", "+00:00")).date()
            except (ValueError, TypeError):
                pass
    if "status" in data:
        s = (data.get("status") or "pending").strip().lower()
        if s in ("pending", "complete"):
            task.status = s
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to update task"}), 500
    return jsonify(task.to_dict()), 200


@tasks_bp.route("/<int:project_id>/tasks/<int:task_id>", methods=["DELETE"])
def delete(project_id, task_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    task = Task.query.filter_by(id=task_id, project_id=project_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    try:
        db.session.delete(task)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to delete task"}), 500
    return jsonify({"message": "Task deleted"}), 200
