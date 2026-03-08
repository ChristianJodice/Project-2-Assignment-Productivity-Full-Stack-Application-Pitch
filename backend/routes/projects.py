"""Projects CRUD with ownership and pagination."""
from flask import Blueprint, request, jsonify
from models import db, Project, Task
from routes.auth import get_current_user_id

projects_bp = Blueprint("projects", __name__)

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


@projects_bp.route("", methods=["GET"])
def index():
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", PER_PAGE, type=int), 50)
    per_page = max(1, per_page)
    pagination = Project.query.filter_by(user_id=user_id).order_by(Project.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    items = [p.to_dict() for p in pagination.items]
    return jsonify({
        "projects": items,
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "pages": pagination.pages,
    }), 200


@projects_bp.route("", methods=["POST"])
def create():
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Project name is required"}), 400
    project = Project(name=name, description=(data.get("description") or "").strip() or None, user_id=user_id)
    db.session.add(project)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create project"}), 500
    return jsonify(project.to_dict()), 201


@projects_bp.route("/<int:project_id>", methods=["GET"])
def get(project_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    return jsonify(project.to_dict()), 200


@projects_bp.route("/<int:project_id>", methods=["PATCH", "PUT"])
def update(project_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    if "name" in data:
        name = (data.get("name") or "").strip()
        if not name:
            return jsonify({"error": "Project name cannot be empty"}), 400
        project.name = name
    if "description" in data:
        project.description = (data.get("description") or "").strip() or None
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to update project"}), 500
    return jsonify(project.to_dict()), 200


@projects_bp.route("/<int:project_id>", methods=["DELETE"])
def delete(project_id):
    user_id, err_resp, err_code = _require_auth()
    if err_resp is not None:
        return err_resp, err_code
    project, err_resp, err_code = _get_project_or_404(project_id, user_id)
    if err_resp is not None:
        return err_resp, err_code
    try:
        db.session.delete(project)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to delete project"}), 500
    return jsonify({"message": "Project deleted"}), 200
