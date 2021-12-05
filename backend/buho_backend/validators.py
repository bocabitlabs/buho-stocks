from rest_framework import serializers


def validate_ownership(context, value, class_name):
    user_id = context["request"].user.id
    try:
        if value.user.id != user_id:
            raise serializers.ValidationError(
                f"${class_name.__name__} must belong to the user"
            )
    except class_name.DoesNotExist as doesnt_exist:
        raise serializers.ValidationError(
            {{class_name.__name__}: "invalid id"}
        ) from doesnt_exist
