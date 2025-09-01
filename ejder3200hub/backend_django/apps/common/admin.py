from django.contrib import admin
from .models import Comment, Feedback, PurchaseRequest, Invoice

admin.site.register(Comment)
admin.site.register(Feedback)
admin.site.register(PurchaseRequest)
admin.site.register(Invoice)