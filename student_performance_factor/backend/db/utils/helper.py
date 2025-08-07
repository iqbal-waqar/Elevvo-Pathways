def student_to_dict(student):
    return {
        'id': student.id,
        'name': student.name,
        'study_hours': student.study_hours,
        'score': student.score
    }
